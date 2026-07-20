-- =============================================================================
-- Studuel — Migration 179 : DECKS DE FLASHCARDS GRATUITS pour 5e, 4e, 2de, Tle
--
-- CONTEXTE (mesure du contenu du Défi, 2026-07-20) :
--   Mesuré en base avec la clé anon, decks gratuits par classe :
--     6e = 2 · 5e = 0 · 4e = 0 · 3e = 1 · 2de = 0 · 1re = 1 · Tle = 0
--   Or la salle de jeu du Défi (`/defi/jouer`) pioche un deck GRATUIT de la
--   classe de l'élève pour glisser jusqu'à 3 cartes dans le pool
--   (`flashcard_decks … is_free = true`). Pour quatre classes sur sept, ce
--   tirage revenait donc toujours vide : les modes tournaient uniquement sur
--   des QCM, sans jamais la respiration d'une carte recto/verso. Rien ne
--   cassait — c'est justement pour ça que le trou est passé inaperçu.
--
--   Un deck gratuit par classe manquante suffit à rétablir la variété.
--   Sujets choisis au cœur du programme de chaque niveau, pour que les cartes
--   servent aussi en révision réelle et pas seulement de décor :
--     - 5e  : nombres relatifs (le grand saut de l'année) ;
--     - 4e  : théorème de Pythagore (le théorème-clé du niveau) ;
--     - 2de : structure de l'atome (socle de toute la chimie du lycée) ;
--     - Tle : vocabulaire de la dissertation de philo (transversal, et
--             l'angoisse n°1 des terminales).
--
-- PRÉREQUIS : 007_programme.sql exécutée.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING (réexécutable sans doublon).
-- =============================================================================

INSERT INTO public.flashcard_decks (id, title, subject, grade_level, is_free) VALUES
  ('33333333-3333-4333-8333-333333333311', 'Nombres relatifs',              'Maths',           '5e',  true),
  ('33333333-3333-4333-8333-333333333312', 'Théorème de Pythagore',         'Maths',           '4e',  true),
  ('33333333-3333-4333-8333-333333333313', 'Structure de l''atome',         'Physique-Chimie', '2de', true),
  ('33333333-3333-4333-8333-333333333314', 'Vocabulaire de la dissertation','Philosophie',     'Tle', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.deck_cards (id, deck_id, front, back, position) VALUES
  -- ---------------------------------------------------------------- 5e Maths
  ('44444444-4444-4444-8444-444444444501', '33333333-3333-4333-8333-333333333311', 'Nombre relatif', 'Un nombre précédé d''un signe + ou −. Exemples : +5, −3,2.', 1),
  ('44444444-4444-4444-8444-444444444502', '33333333-3333-4333-8333-333333333311', 'Nombres opposés', 'Deux nombres de même distance à zéro mais de signes contraires : +7 et −7. Leur somme vaut 0.', 2),
  ('44444444-4444-4444-8444-444444444503', '33333333-3333-4333-8333-333333333311', 'Additionner deux relatifs de MÊME signe', 'On additionne les distances à zéro et on garde le signe commun. (−4) + (−6) = −10.', 3),
  ('44444444-4444-4444-8444-444444444504', '33333333-3333-4333-8333-333333333311', 'Additionner deux relatifs de signes CONTRAIRES', 'On soustrait les distances à zéro et on garde le signe du plus « éloigné » de 0. (−9) + (+4) = −5.', 4),
  ('44444444-4444-4444-8444-444444444505', '33333333-3333-4333-8333-333333333311', 'Soustraire un relatif', 'Soustraire, c''est ajouter l''opposé : 5 − (−3) = 5 + 3 = 8.', 5),
  ('44444444-4444-4444-8444-444444444506', '33333333-3333-4333-8333-333333333311', 'Signe d''un produit de deux relatifs', 'Mêmes signes → positif. Signes contraires → négatif. (−3) × (−4) = +12.', 6),
  ('44444444-4444-4444-8444-444444444507', '33333333-3333-4333-8333-333333333311', 'Distance à zéro', 'La distance d''un nombre à 0 sur la droite graduée, toujours positive. Celle de −8 est 8.', 7),
  ('44444444-4444-4444-8444-444444444508', '33333333-3333-4333-8333-333333333311', 'Comparer deux relatifs négatifs', 'Le plus grand est celui dont la distance à zéro est la PLUS PETITE : −2 > −7.', 8),
  ('44444444-4444-4444-8444-444444444509', '33333333-3333-4333-8333-333333333311', 'Abscisse d''un point', 'Le nombre relatif qui repère un point sur une droite graduée.', 9),
  ('44444444-4444-4444-8444-44444444450a', '33333333-3333-4333-8333-333333333311', 'Piège classique', '−5² et (−5)² ne sont PAS égaux : −5² = −25, alors que (−5)² = +25.', 10),

  -- ---------------------------------------------------------------- 4e Maths
  ('44444444-4444-4444-8444-444444444511', '33333333-3333-4333-8333-333333333312', 'Théorème de Pythagore', 'Dans un triangle RECTANGLE, le carré de l''hypoténuse est égal à la somme des carrés des deux autres côtés.', 1),
  ('44444444-4444-4444-8444-444444444512', '33333333-3333-4333-8333-333333333312', 'Hypoténuse', 'Le côté opposé à l''angle droit — toujours le plus long du triangle rectangle.', 2),
  ('44444444-4444-4444-8444-444444444513', '33333333-3333-4333-8333-333333333312', 'L''égalité à écrire (ABC rectangle en A)', 'BC² = AB² + AC². L''hypoténuse est SEULE d''un côté du signe égal.', 3),
  ('44444444-4444-4444-8444-444444444514', '33333333-3333-4333-8333-333333333312', 'À quoi sert Pythagore ?', 'À calculer la longueur d''un côté quand on connaît les deux autres, dans un triangle rectangle.', 4),
  ('44444444-4444-4444-8444-444444444515', '33333333-3333-4333-8333-333333333312', 'Réciproque du théorème', 'Si BC² = AB² + AC², alors le triangle est rectangle en A. Elle sert à PROUVER l''angle droit.', 5),
  ('44444444-4444-4444-8444-444444444516', '33333333-3333-4333-8333-333333333312', 'Prouver qu''un triangle n''est PAS rectangle', 'On calcule séparément le plus grand carré et la somme des deux autres : s''ils diffèrent, il n''est pas rectangle.', 6),
  ('44444444-4444-4444-8444-444444444517', '33333333-3333-4333-8333-333333333312', 'Calculer un côté de l''angle droit', 'On SOUSTRAIT : AB² = BC² − AC², puis on prend la racine carrée.', 7),
  ('44444444-4444-4444-8444-444444444518', '33333333-3333-4333-8333-333333333312', 'Triplet pythagoricien 3-4-5', '3² + 4² = 9 + 16 = 25 = 5². Un triangle de côtés 3, 4 et 5 est rectangle.', 8),
  ('44444444-4444-4444-8444-444444444519', '33333333-3333-4333-8333-333333333312', 'Erreur la plus fréquente', 'Additionner les carrés pour trouver un côté de l''angle droit. Pour l''hypoténuse on ADDITIONNE, pour un autre côté on SOUSTRAIT.', 9),
  ('44444444-4444-4444-8444-44444444451a', '33333333-3333-4333-8333-333333333312', 'Condition d''emploi', 'Aucun calcul de Pythagore sans angle droit : sans lui, le théorème ne s''applique pas.', 10),

  -- --------------------------------------------------- 2de Physique-Chimie
  ('44444444-4444-4444-8444-444444444521', '33333333-3333-4333-8333-333333333313', 'Composition d''un atome', 'Un noyau (protons + neutrons) autour duquel gravitent des électrons.', 1),
  ('44444444-4444-4444-8444-444444444522', '33333333-3333-4333-8333-333333333313', 'Charge des trois particules', 'Proton : positive (+e). Électron : négative (−e). Neutron : neutre.', 2),
  ('44444444-4444-4444-8444-444444444523', '33333333-3333-4333-8333-333333333313', 'Numéro atomique Z', 'Le nombre de PROTONS du noyau. Il identifie l''élément chimique.', 3),
  ('44444444-4444-4444-8444-444444444524', '33333333-3333-4333-8333-333333333313', 'Nombre de masse A', 'Le nombre de NUCLÉONS : protons + neutrons. Nombre de neutrons = A − Z.', 4),
  ('44444444-4444-4444-8444-444444444525', '33333333-3333-4333-8333-333333333313', 'Pourquoi l''atome est-il neutre ?', 'Il compte autant de protons que d''électrons : les charges se compensent exactement.', 5),
  ('44444444-4444-4444-8444-444444444526', '33333333-3333-4333-8333-333333333313', 'Isotopes', 'Des atomes de même Z (même élément) mais de A différents : ils diffèrent par leur nombre de neutrons.', 6),
  ('44444444-4444-4444-8444-444444444527', '33333333-3333-4333-8333-333333333313', 'Ion monoatomique', 'Un atome qui a gagné ou perdu des électrons. Gagner → anion (négatif) ; perdre → cation (positif).', 7),
  ('44444444-4444-4444-8444-444444444528', '33333333-3333-4333-8333-333333333313', 'Où se trouve la masse ?', 'Quasiment toute la masse est dans le noyau : un nucléon pèse environ 1 800 fois plus qu''un électron.', 8),
  ('44444444-4444-4444-8444-444444444529', '33333333-3333-4333-8333-333333333313', 'Structure lacunaire', 'L''atome est essentiellement du vide : son noyau est environ 100 000 fois plus petit que lui.', 9),
  ('44444444-4444-4444-8444-44444444452a', '33333333-3333-4333-8333-333333333313', 'Règle du duet et de l''octet', 'Un atome évolue pour saturer sa couche externe : 2 électrons (duet) pour les plus légers, 8 (octet) ensuite.', 10),

  -- ------------------------------------------------------- Tle Philosophie
  ('44444444-4444-4444-8444-444444444531', '33333333-3333-4333-8333-333333333314', 'Problématiser', 'Transformer la question en PROBLÈME : montrer que deux réponses opposées sont défendables.', 1),
  ('44444444-4444-4444-8444-444444444532', '33333333-3333-4333-8333-333333333314', 'Thèse', 'La réponse qu''on défend, énoncée clairement — pas une opinion vague.', 2),
  ('44444444-4444-4444-8444-444444444533', '33333333-3333-4333-8333-333333333314', 'Antithèse', 'La position opposée, présentée avec la même rigueur : on ne fabrique pas un adversaire faible.', 3),
  ('44444444-4444-4444-8444-444444444534', '33333333-3333-4333-8333-333333333314', 'Dépassement (3e partie)', 'Non pas « un peu des deux », mais un déplacement du problème : souvent en distinguant deux sens d''un mot.', 4),
  ('44444444-4444-4444-8444-444444444535', '33333333-3333-4333-8333-333333333314', 'Rôle de l''exemple', 'Il ILLUSTRE ou met à l''épreuve un argument — il ne le remplace jamais.', 5),
  ('44444444-4444-4444-8444-444444444536', '33333333-3333-4333-8333-333333333314', 'Analyser les termes du sujet', 'Définir chaque mot ET repérer ses sens multiples : c''est là que naît le problème.', 6),
  ('44444444-4444-4444-8444-444444444537', '33333333-3333-4333-8333-333333333314', 'Nécessaire / contingent', 'Nécessaire : ce qui ne peut pas ne pas être. Contingent : ce qui est, mais aurait pu ne pas être.', 7),
  ('44444444-4444-4444-8444-444444444538', '33333333-3333-4333-8333-333333333314', 'Condition nécessaire / suffisante', 'Nécessaire : indispensable, mais peut ne pas suffire. Suffisante : elle entraîne à elle seule la conséquence.', 8),
  ('44444444-4444-4444-8444-444444444539', '33333333-3333-4333-8333-333333333314', 'En droit / en fait', 'En fait : ce qui se passe réellement. En droit : ce qui devrait être, par principe.', 9),
  ('44444444-4444-4444-8444-44444444453a', '33333333-3333-4333-8333-333333333314', 'Erreur qui coûte le plus cher', 'Réciter le cours sur la notion sans jamais répondre à la question POSÉE : le hors-sujet.', 10)
ON CONFLICT (id) DO NOTHING;
