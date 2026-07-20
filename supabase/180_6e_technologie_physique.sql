-- =============================================================================
-- Studuel — Migration 180 : SCIENCES ET TECHNOLOGIE EN 6e (contenu neuf)
--
-- CONTEXTE (mesure du contenu, 2026-07-20) :
--   La 6e est la classe la plus pauvre du catalogue — et c'est la classe
--   d'ENTRÉE, celle où se joue la rétention des nouveaux élèves :
--     6e = 25 quiz / 5 matières   vs   5e = 40 quiz / 9 matières
--   Matières présentes en 5e mais absentes en 6e : Technologie, Physique-Chimie,
--   Espagnol, Latin.
--
--   ⚠️ On n'ajoute VOLONTAIREMENT que Technologie et Physique-Chimie.
--   L'Espagnol (LV2) et le Latin commencent en 5e dans le système français :
--   les proposer en 6e serait faux pédagogiquement, et un élève de 6e qui voit
--   une matière qu'il n'a pas au collège perd confiance dans l'app. En 6e ces
--   deux matières relèvent de « Sciences et technologie » — la SVT y est déjà
--   traitée à part dans Studuel, on suit la même logique.
--
--   Chaque matière reçoit 2 chapitres → 1 leçon → 1 quiz de 10 questions,
--   soit +4 quiz et +40 questions pour la 6e (25 → 29 quiz, 5 → 7 matières).
--
-- PRÉREQUIS : 002_quizzes.sql, 007_programme.sql, 008_reviser.sql exécutées.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING ; l'ouverture du niveau ne
-- s'applique que si « 6e » n'y est pas déjà.
-- =============================================================================

-- 1. Ouvrir les deux matières au niveau 6e (sinon leurs chapitres resteraient
--    invisibles : Réviser filtre les matières sur `levels`). Ajout NON destructif
--    et non dupliquant.
UPDATE public.subjects
   SET levels = '["6e"]'::jsonb || levels
 WHERE name IN ('Technologie', 'Physique-Chimie')
   AND NOT (levels @> '["6e"]'::jsonb);

-- 2. Chapitres (niveau 6e)
INSERT INTO public.chapters (id, subject_id, level, title, position)
SELECT v.id, s.id, '6e', v.title, v.position
  FROM (VALUES
    ('55555555-5555-4555-8555-555555555601'::uuid, 'Technologie',     'Objets techniques du quotidien', 1),
    ('55555555-5555-4555-8555-555555555602'::uuid, 'Technologie',     'Matériaux et usages',            2),
    ('55555555-5555-4555-8555-555555555603'::uuid, 'Physique-Chimie', 'États et changements d''état',   1),
    ('55555555-5555-4555-8555-555555555604'::uuid, 'Physique-Chimie', 'Sources et formes d''énergie',   2)
  ) AS v(id, subject_name, title, position)
  JOIN public.subjects s ON s.name = v.subject_name
ON CONFLICT (id) DO NOTHING;

-- 3. Leçons (une par chapitre)
INSERT INTO public.lessons (id, chapter_id, title, content, position) VALUES
  ('66666666-6666-4666-8666-666666666601', '55555555-5555-4555-8555-555555555601', 'À quoi sert un objet technique ?',
   E'Un **objet technique** est fabriqué par l''être humain pour répondre à un **besoin**.\n\n## La fonction d''usage\nC''est la réponse à la question : « à quoi ça sert ? ». Un vélo sert à se déplacer.\n\n## La fonction d''estime\nC''est ce qui fait qu''on le choisit plutôt qu''un autre : la couleur, la forme, la marque. Deux objets peuvent avoir la même fonction d''usage et des fonctions d''estime très différentes.\n\n## Les contraintes\nUn objet technique doit respecter des contraintes : de sécurité, de coût, d''environnement. C''est ce qui explique pourquoi il n''existe pas d''objet « parfait ».', 1),

  ('66666666-6666-4666-8666-666666666602', '55555555-5555-4555-8555-555555555602', 'Choisir le bon matériau',
   E'Chaque matériau a des **propriétés** qui le rendent adapté — ou non — à un usage.\n\n## Les grandes familles\n- **Métaux** : solides, conducteurs, recyclables (acier, aluminium).\n- **Plastiques** : légers, isolants, façonnables, mais issus du pétrole.\n- **Céramiques et verres** : durs, résistants à la chaleur, mais fragiles.\n- **Matériaux organiques** : bois, papier, textile, souvent renouvelables.\n\n## Le bon choix\nOn choisit un matériau en croisant ses propriétés, son coût et son impact sur l''environnement. Une casserole a un fond métallique (conducteur) et un manche plastique (isolant) : deux matériaux, deux rôles.', 1),

  ('66666666-6666-4666-8666-666666666603', '55555555-5555-4555-8555-555555555603', 'Solide, liquide, gaz',
   E'La matière existe sous trois **états physiques**.\n\n## Reconnaître les trois états\n- **Solide** : forme propre, volume propre.\n- **Liquide** : pas de forme propre (il épouse le récipient), mais un volume propre.\n- **Gaz** : ni forme ni volume propres, il occupe tout l''espace disponible.\n\n## Les changements d''état\n- Solide → liquide : **fusion**\n- Liquide → solide : **solidification**\n- Liquide → gaz : **vaporisation**\n- Gaz → liquide : **condensation** (ou liquéfaction)\n\n## L''essentiel à retenir\nPendant un changement d''état, la **température ne change pas** : l''eau pure fond à 0 °C et bout à 100 °C. Et la **masse se conserve** — seul le volume peut varier.', 1),

  ('66666666-6666-4666-8666-666666666604', '55555555-5555-4555-8555-555555555604', 'D''où vient l''énergie ?',
   E'L''énergie permet de **chauffer, éclairer, déplacer**.\n\n## Les sources d''énergie\n- **Renouvelables** : soleil, vent, eau, biomasse — elles se reconstituent à l''échelle humaine.\n- **Non renouvelables** : charbon, pétrole, gaz, uranium — leurs stocks sont limités.\n\n## Les formes d''énergie\nÉlectrique, thermique (chaleur), lumineuse, sonore, de mouvement.\n\n## Conversion et chaîne d''énergie\nUn objet technique **convertit** une forme d''énergie en une autre : une lampe convertit l''énergie électrique en lumière (et en chaleur). L''énergie ne se crée pas et ne disparaît pas : elle se **transforme**.', 1)
ON CONFLICT (id) DO NOTHING;

-- 4. Quiz (rattachés aux leçons)
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id) VALUES
  ('04900000-0000-4000-8000-000000006601', 'Quiz — À quoi sert un objet technique ?', 'Technologie',     '6e', 'Objets techniques du quotidien', true, '66666666-6666-4666-8666-666666666601'),
  ('04900000-0000-4000-8000-000000006602', 'Quiz — Choisir le bon matériau',          'Technologie',     '6e', 'Matériaux et usages',            true, '66666666-6666-4666-8666-666666666602'),
  ('04900000-0000-4000-8000-000000006603', 'Quiz — Solide, liquide, gaz',             'Physique-Chimie', '6e', 'États et changements d''état',   true, '66666666-6666-4666-8666-666666666603'),
  ('04900000-0000-4000-8000-000000006604', 'Quiz — D''où vient l''énergie ?',          'Physique-Chimie', '6e', 'Sources et formes d''énergie',   true, '66666666-6666-4666-8666-666666666604')
ON CONFLICT (id) DO NOTHING;

-- 5. Questions (10 par quiz)
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position) VALUES
  -- ---------------------------------------- Techno : objets techniques
  ('77777777-7777-4777-8777-777777770101', '04900000-0000-4000-8000-000000006601', 'Qu''est-ce qu''un objet technique ?', 'mcq', '["Un objet fabriqué par l''homme pour répondre à un besoin","Un objet trouvé dans la nature","Un objet uniquement électronique","Un objet toujours en métal"]', 0, 'Un objet technique est conçu et fabriqué par l''être humain pour satisfaire un besoin.', 1),
  ('77777777-7777-4777-8777-777777770102', '04900000-0000-4000-8000-000000006601', 'La fonction d''usage d''un objet répond à la question…', 'mcq', '["À quoi sert-il ?","Est-il joli ?","Combien coûte-t-il ?","Qui l''a fabriqué ?"]', 0, 'La fonction d''usage, c''est le service rendu : à quoi l''objet sert.', 2),
  ('77777777-7777-4777-8777-777777770103', '04900000-0000-4000-8000-000000006601', 'Choisir un vélo rouge plutôt qu''un bleu relève de la fonction d''estime.', 'true_false', '["Vrai","Faux"]', 0, 'La fonction d''estime regroupe tout ce qui donne envie de choisir cet objet-là : couleur, forme, marque.', 3),
  ('77777777-7777-4777-8777-777777770104', '04900000-0000-4000-8000-000000006601', 'Un stylo et un crayon ont la même fonction d''usage. Laquelle ?', 'mcq', '["Écrire","Coûter cher","Être en bois","Être rechargeable"]', 0, 'Deux objets différents peuvent rendre le même service : ici, écrire.', 4),
  ('77777777-7777-4777-8777-777777770105', '04900000-0000-4000-8000-000000006601', 'Qu''est-ce qu''une contrainte pour un objet technique ?', 'mcq', '["Une exigence à respecter (sécurité, coût, environnement)","Un défaut de fabrication","Une panne","Un accessoire en option"]', 0, 'Les contraintes encadrent la conception : sécurité, coût, matériaux, impact environnemental.', 5),
  ('77777777-7777-4777-8777-777777770106', '04900000-0000-4000-8000-000000006601', 'Tous les objets techniques fonctionnent à l''électricité.', 'true_false', '["Vrai","Faux"]', 1, 'Faux : une chaise, une paire de ciseaux ou un vélo sont des objets techniques sans électricité.', 6),
  ('77777777-7777-4777-8777-777777770107', '04900000-0000-4000-8000-000000006601', 'Le besoin auquel répond un parapluie est…', 'mcq', '["Se protéger de la pluie","Se déplacer plus vite","Communiquer","Se nourrir"]', 0, 'L''objet technique naît toujours d''un besoin ; celui du parapluie est la protection contre la pluie.', 7),
  ('77777777-7777-4777-8777-777777770108', '04900000-0000-4000-8000-000000006601', 'Que signifie « recycler » un objet en fin de vie ?', 'mcq', '["Récupérer ses matériaux pour en fabriquer de nouveaux","Le jeter à la poubelle","Le réparer","Le revendre d''occasion"]', 0, 'Le recyclage réintroduit les matériaux dans un nouveau cycle de fabrication.', 8),
  ('77777777-7777-4777-8777-777777770109', '04900000-0000-4000-8000-000000006601', 'Deux objets ayant la même fonction d''usage sont forcément identiques.', 'true_false', '["Vrai","Faux"]', 1, 'Faux : une bougie et une lampe éclairent toutes les deux, mais tout les sépare.', 9),
  ('77777777-7777-4777-8777-77777777010a', '04900000-0000-4000-8000-000000006601', 'À quoi sert un cahier des charges ?', 'mcq', '["À lister les besoins et contraintes avant de concevoir","À vendre l''objet","À réparer l''objet","À noter les élèves"]', 0, 'Le cahier des charges fixe ce que l''objet devra faire et respecter, avant toute fabrication.', 10),

  -- ---------------------------------------------- Techno : matériaux
  ('77777777-7777-4777-8777-777777770201', '04900000-0000-4000-8000-000000006602', 'Quel matériau est un bon conducteur de chaleur ?', 'mcq', '["Le métal","Le plastique","Le bois","Le verre"]', 0, 'Les métaux conduisent bien la chaleur et l''électricité : d''où le fond métallique des casseroles.', 1),
  ('77777777-7777-4777-8777-777777770202', '04900000-0000-4000-8000-000000006602', 'Pourquoi le manche d''une casserole est-il souvent en plastique ?', 'mcq', '["Le plastique est isolant : on ne se brûle pas","Le plastique est plus lourd","Le plastique conduit la chaleur","Pour la décoration"]', 0, 'Un isolant thermique ne transmet pas la chaleur : la main reste protégée.', 2),
  ('77777777-7777-4777-8777-777777770203', '04900000-0000-4000-8000-000000006602', 'Le bois est un matériau renouvelable.', 'true_false', '["Vrai","Faux"]', 0, 'Vrai : un arbre repousse, à condition que la forêt soit gérée durablement.', 3),
  ('77777777-7777-4777-8777-777777770204', '04900000-0000-4000-8000-000000006602', 'De quoi la plupart des plastiques sont-ils issus ?', 'mcq', '["Du pétrole","Du sable","Du minerai de fer","De l''argile"]', 0, 'La majorité des plastiques sont fabriqués à partir du pétrole, une ressource non renouvelable.', 4),
  ('77777777-7777-4777-8777-777777770205', '04900000-0000-4000-8000-000000006602', 'Quelle propriété rend le verre fragile ?', 'mcq', '["Il casse net sans se déformer","Il est trop léger","Il est conducteur","Il rouille"]', 0, 'Le verre est dur mais cassant : il se brise au lieu de se déformer.', 5),
  ('77777777-7777-4777-8777-777777770206', '04900000-0000-4000-8000-000000006602', 'Quel matériau choisir pour une vitre ?', 'mcq', '["Le verre, car il est transparent","Le bois, car il est solide","L''acier, car il est résistant","Le tissu, car il est souple"]', 0, 'On choisit un matériau selon la propriété utile à l''usage : ici, la transparence.', 6),
  ('77777777-7777-4777-8777-777777770207', '04900000-0000-4000-8000-000000006602', 'L''aluminium se recycle indéfiniment sans perdre ses propriétés.', 'true_false', '["Vrai","Faux"]', 0, 'Vrai : c''est l''un des grands atouts des métaux face aux plastiques.', 7),
  ('77777777-7777-4777-8777-777777770208', '04900000-0000-4000-8000-000000006602', 'Un matériau isolant électrique…', 'mcq', '["Ne laisse pas passer le courant","Laisse passer le courant","Produit du courant","Stocke le courant"]', 0, 'C''est pourquoi les fils électriques sont gainés de plastique.', 8),
  ('77777777-7777-4777-8777-777777770209', '04900000-0000-4000-8000-000000006602', 'Pourquoi un vélo de course est-il souvent en aluminium ou en carbone ?', 'mcq', '["Ces matériaux sont légers et résistants","Ils sont les moins chers","Ils sont transparents","Ils sont isolants"]', 0, 'La légèreté associée à la résistance est déterminante pour la performance.', 9),
  ('77777777-7777-4777-8777-77777777020a', '04900000-0000-4000-8000-000000006602', 'Le choix d''un matériau dépend uniquement de son prix.', 'true_false', '["Vrai","Faux"]', 1, 'Faux : on croise ses propriétés, son coût ET son impact sur l''environnement.', 10),

  -- ------------------------------------- Physique-Chimie : états de la matière
  ('77777777-7777-4777-8777-777777770301', '04900000-0000-4000-8000-000000006603', 'Quels sont les trois états physiques de la matière ?', 'mcq', '["Solide, liquide, gaz","Chaud, tiède, froid","Dur, mou, cassant","Petit, moyen, grand"]', 0, 'Ce sont les trois états physiques étudiés en 6e.', 1),
  ('77777777-7777-4777-8777-777777770302', '04900000-0000-4000-8000-000000006603', 'Quel état a un volume propre mais pas de forme propre ?', 'mcq', '["Liquide","Solide","Gaz","Aucun"]', 0, 'Un liquide garde son volume mais épouse la forme du récipient.', 2),
  ('77777777-7777-4777-8777-777777770303', '04900000-0000-4000-8000-000000006603', 'Le passage de l''état solide à l''état liquide s''appelle…', 'mcq', '["La fusion","La solidification","La vaporisation","La condensation"]', 0, 'La fusion : la glace qui fond en est l''exemple le plus courant.', 3),
  ('77777777-7777-4777-8777-777777770304', '04900000-0000-4000-8000-000000006603', 'Sous pression normale, l''eau pure bout à…', 'mcq', '["100 °C","0 °C","50 °C","212 °C"]', 0, 'L''eau pure bout à 100 °C et fond à 0 °C sous la pression atmosphérique normale.', 4),
  ('77777777-7777-4777-8777-777777770305', '04900000-0000-4000-8000-000000006603', 'Pendant un changement d''état, la température reste constante.', 'true_false', '["Vrai","Faux"]', 0, 'Vrai : tant que la glace fond, la température du mélange reste à 0 °C.', 5),
  ('77777777-7777-4777-8777-777777770306', '04900000-0000-4000-8000-000000006603', 'Quand de l''eau gèle, sa masse…', 'mcq', '["Reste la même","Augmente","Diminue","Devient nulle"]', 0, 'La masse se conserve lors d''un changement d''état ; c''est le volume qui augmente.', 6),
  ('77777777-7777-4777-8777-777777770307', '04900000-0000-4000-8000-000000006603', 'La buée sur une vitre froide est due à…', 'mcq', '["La condensation de la vapeur d''eau","La fusion de la glace","L''évaporation de l''eau","La solidification de l''air"]', 0, 'La vapeur d''eau de l''air redevient liquide au contact de la surface froide.', 7),
  ('77777777-7777-4777-8777-777777770308', '04900000-0000-4000-8000-000000006603', 'Un gaz occupe tout le volume qui lui est offert.', 'true_false', '["Vrai","Faux"]', 0, 'Vrai : un gaz n''a ni forme ni volume propres, il se répand dans tout l''espace disponible.', 8),
  ('77777777-7777-4777-8777-777777770309', '04900000-0000-4000-8000-000000006603', 'Comment appelle-t-on le passage de l''état liquide à l''état gazeux ?', 'mcq', '["La vaporisation","La condensation","La fusion","La solidification"]', 0, 'La vaporisation ; l''ébullition en est la forme rapide.', 9),
  ('77777777-7777-4777-8777-77777777030a', '04900000-0000-4000-8000-000000006603', 'La glace, l''eau liquide et la vapeur sont trois corps différents.', 'true_false', '["Vrai","Faux"]', 1, 'Faux : c''est la MÊME substance (l''eau) dans trois états physiques différents.', 10),

  -- ----------------------------------------------- Physique-Chimie : énergie
  ('77777777-7777-4777-8777-777777770401', '04900000-0000-4000-8000-000000006604', 'Laquelle de ces sources d''énergie est renouvelable ?', 'mcq', '["Le vent","Le charbon","Le pétrole","Le gaz naturel"]', 0, 'Le vent se renouvelle en permanence ; les trois autres sont des énergies fossiles.', 1),
  ('77777777-7777-4777-8777-777777770402', '04900000-0000-4000-8000-000000006604', 'Une lampe convertit l''énergie électrique en…', 'mcq', '["Lumière et chaleur","Son uniquement","Mouvement","Énergie chimique"]', 0, 'Une lampe éclaire mais chauffe aussi : une partie de l''énergie est convertie en chaleur.', 2),
  ('77777777-7777-4777-8777-777777770403', '04900000-0000-4000-8000-000000006604', 'Le pétrole est une énergie fossile, donc non renouvelable.', 'true_false', '["Vrai","Faux"]', 0, 'Vrai : sa formation demande des millions d''années, ses stocks sont limités.', 3),
  ('77777777-7777-4777-8777-777777770404', '04900000-0000-4000-8000-000000006604', 'Que fait une éolienne ?', 'mcq', '["Elle convertit l''énergie du vent en électricité","Elle produit du vent","Elle stocke l''électricité","Elle chauffe l''eau"]', 0, 'Le vent fait tourner les pales, qui entraînent un alternateur produisant de l''électricité.', 4),
  ('77777777-7777-4777-8777-777777770405', '04900000-0000-4000-8000-000000006604', 'L''énergie peut être créée à partir de rien.', 'true_false', '["Vrai","Faux"]', 1, 'Faux : l''énergie ne se crée pas et ne disparaît pas, elle se transforme.', 5),
  ('77777777-7777-4777-8777-777777770406', '04900000-0000-4000-8000-000000006604', 'Quelle forme d''énergie possède un objet en mouvement ?', 'mcq', '["L''énergie de mouvement","L''énergie lumineuse","L''énergie sonore","L''énergie chimique"]', 0, 'On l''appelle aussi énergie cinétique.', 6),
  ('77777777-7777-4777-8777-777777770407', '04900000-0000-4000-8000-000000006604', 'Un panneau solaire photovoltaïque convertit…', 'mcq', '["La lumière du soleil en électricité","Le vent en chaleur","L''eau en électricité","Le charbon en lumière"]', 0, 'Le photovoltaïque transforme directement la lumière en courant électrique.', 7),
  ('77777777-7777-4777-8777-777777770408', '04900000-0000-4000-8000-000000006604', 'Pourquoi économiser l''énergie ?', 'mcq', '["Pour préserver les ressources et limiter la pollution","Pour rendre les objets plus lourds","Pour augmenter les prix","Cela ne sert à rien"]', 0, 'Économiser l''énergie ménage les ressources limitées et réduit les rejets polluants.', 8),
  ('77777777-7777-4777-8777-777777770409', '04900000-0000-4000-8000-000000006604', 'Une pile stocke de l''énergie sous forme…', 'mcq', '["Chimique","Sonore","Lumineuse","Nucléaire"]', 0, 'La pile convertit son énergie chimique en énergie électrique quand on l''utilise.', 9),
  ('77777777-7777-4777-8777-77777777040a', '04900000-0000-4000-8000-000000006604', 'L''énergie hydraulique utilise la force de l''eau.', 'true_false', '["Vrai","Faux"]', 0, 'Vrai : les barrages exploitent l''écoulement de l''eau pour produire de l''électricité.', 10)
ON CONFLICT (id) DO NOTHING;
