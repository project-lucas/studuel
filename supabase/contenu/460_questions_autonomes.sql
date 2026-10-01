-- =============================================================================
-- Studuel — Migration 460 : QUESTIONS DE QUIZ RENDUES AUTONOMES (1re, Tle)
--
-- 23 fragments, remplacés à l’endroit exact où ils sont.
-- Vingt-trois questions renvoyaient à « cette fonction » ou à « l’exemple de la fiche » : posées seules (flashcards, file « À revoir », duel), elles n’avaient pas de réponse possible. Chacune porte maintenant ses données.
-- La même correction est faite dans la source (scripts/contenu, contenu/controles).
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main. Source : contenu/corrections/.
--    Regénérer : node scripts/corrections-sql.mjs --num 460 --fichiers lot-j-questions-autonomes --titre … --motif … (ceux de l’en-tête)
--
-- Idempotent : chaque UPDATE ne touche que les lignes qui contiennent encore le
-- fragment fautif. À exécuter APRÈS 385 → 399 (les cours qu’elles réécrivent).
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

DROP TABLE IF EXISTS pg_temp._corrections;
CREATE TEMP TABLE _corrections (n int, slug text, level text, chapter text, champ text, ancien text, nouveau text);
INSERT INTO _corrections VALUES
  (1, 'i2d', 'Tle', 'Éco-conception et analyse de cycle de vie', 'question', 'Dans l’exemple, quelle phase domine l’impact des deux ampoules ?', 'Sur 10 000 h, une LED de 8 W émet environ 4,8 kg de CO2 pour son électricité et 2 kg pour sa fabrication. Quelle phase domine son impact ?'),
  (2, 'i2d', 'Tle', 'Méthode : l’épreuve pratique et le projet', 'question', 'Dans l’exemple SIN, pourquoi traiter la cellule par interruption ?', 'Un portail doit s’arrêter en moins de 0,5 s dès qu’un obstacle est détecté. Pourquoi traiter la cellule par interruption ?'),
  (3, 'ingenierie-dd', '1re', 'Comportement mécanique : équilibre et résistance', 'question', 'Dans l’exemple de l’étagère, quelle force la vis doit-elle fournir avec 0,10 m de bras ?', 'La charge d’une étagère crée un moment de 60 N·m. Quelle force la vis doit-elle fournir avec un bras de levier de 0,10 m ?'),
  (4, 'ingenierie-dd', '1re', 'Flux de matière, d’énergie et d’information', 'question', 'Dans l’exemple, quel étage faut-il améliorer en priorité ?', 'Sur une trottinette électrique, le variateur perd 25 W et le moteur 95 W. Quel étage faut-il améliorer en priorité ?'),
  (5, 'innovation-technologique', '1re', 'Ergonomie et expérience utilisateur', 'question', 'Dans l’exemple de la borne, quelle amélioration répond au problème de sécurité ?', 'Sur une borne de recharge, le câble traîne au sol. Quelle amélioration répond à ce problème de sécurité ?'),
  (6, 'innovation-technologique', '1re', 'La maquette numérique', 'question', 'Dans l’exemple, pourquoi porter l’encoche à 10 mm pour un téléphone de 9 mm ?', 'Pourquoi donner 10 mm à l’encoche d’un support prévu pour un téléphone de 9 mm d’épaisseur ?'),
  (7, 'innovation-technologique', '1re', 'Le compromis fonction, coût, besoin', 'question', 'Dans l’exemple de la lampe, quelle fonction est trop chère par rapport à son importance ?', 'Sur une lampe, « plaire » coûte 30 % du prix pour 10 % de l’importance, « éclairer » 35 % pour 50 %. Quelle fonction est trop chère par rapport à son importance ?'),
  (8, 'management', '1re', 'La stratégie des organisations de la société civile', 'question', 'Dans l’exemple du club de basket, la dépendance à une seule subvention est…', 'Pour un club de basket amateur, dépendre d’une seule subvention municipale est…'),
  (9, 'maths', '1re', 'Automatismes : statistiques et probabilités', 'question', 'Dans le tableau croisé du cours, que vaut P(F inter L) ?', 'Sur 200 élèves, 120 sont des filles ; 60 élèves font du latin, dont 45 filles. Que vaut P(F inter L) ?'),
  (10, 'maths', '1re', 'Automatismes : statistiques et probabilités', 'question', 'Dans le même tableau, que vaut la probabilité qu’un élève soit latiniste sachant que c’est une fille ?', 'Sur 200 élèves, 120 sont des filles ; 60 font du latin, dont 45 filles. Quelle est la probabilité qu’un élève soit latiniste sachant que c’est une fille ?'),
  (11, 'maths', '1re', 'Automatismes : statistiques et probabilités', 'question', 'Dans le même tableau, que vaut la probabilité qu’un élève soit une fille sachant qu’il est latiniste ?', 'Sur 200 élèves, 120 sont des filles ; 60 font du latin, dont 45 filles. Quelle est la probabilité qu’un élève soit une fille sachant qu’il est latiniste ?'),
  (12, 'maths', '1re', 'Seuil, Newton, Euler : les algorithmes à connaître', 'question', 'Que renvoie la fonction seuil() du cours ?', 'Un algorithme de seuil cherche quand une suite dépasse une valeur donnée. Que renvoie-t-il ?'),
  (13, 'maths-techno', '1re', 'Automatismes : statistiques et probabilités', 'question', 'Dans le tableau de la fiche (48 sportives sur 120 filles, 200 élèves), combien vaut P_F(S) ?', 'Sur 200 élèves, 120 sont des filles, dont 48 sportives. Combien vaut P_F(S) ?'),
  (14, 'maths-techno', '1re', 'Automatismes : statistiques et probabilités', 'question', 'Dans le même tableau, combien vaut P(F ∩ S) ?', 'Sur 200 élèves, 48 sont des filles sportives. Combien vaut P(F ∩ S) ?'),
  (15, 'maths-techno', '1re', 'Automatismes : statistiques et probabilités', 'question', 'Dans le même tableau (88 sportifs, dont 48 filles), P_S(F) vaut…', 'Sur 200 élèves, 88 sont sportifs, dont 48 filles. P_S(F) vaut…'),
  (16, 'maths-techno', '1re', 'Automatismes : statistiques et probabilités', 'question', 'Dans le tableau de la fiche, quelle est la fréquence marginale des garçons ?', 'Un tableau croisé compte 80 garçons sur 200 élèves. Quelle est la fréquence marginale des garçons ?'),
  (17, 'maths-techno', '1re', 'Probabilités conditionnelles et indépendance', 'question', 'Dans l’exemple de la fiche, P(C ∩ L) = 0,18 et P(C̄ ∩ L) = 0,04. Combien vaut P(L) ?', 'P(C ∩ L) = 0,18 et P(C̄ ∩ L) = 0,04. Combien vaut P(L) ?'),
  (18, 'maths-techno', '1re', 'Probabilités conditionnelles et indépendance', 'question', 'Dans l’exemple de la fiche, que vaut P_L(C) ?', 'P(C ∩ L) = 0,18 et P(L) = 0,22. Que vaut P_L(C) ?'),
  (19, 'maths-techno', 'Tle', 'Probabilités conditionnelles, arbres et indépendance', 'question', 'Dans l’exemple de la fiche, combien vaut P(A ∩ D) ?', 'La machine A fabrique 50 % des pièces, et 2 % de ses pièces ont un défaut (D). Combien vaut P(A ∩ D) ?'),
  (20, 'maths-techno', 'Tle', 'Probabilités conditionnelles, arbres et indépendance', 'question', 'Dans l’exemple de la fiche, combien vaut P(D) ?', 'P(A ∩ D) = 0,010, P(B ∩ D) = 0,009 et P(C ∩ D) = 0,010. Combien vaut P(D) ?'),
  (21, 'maths-techno', 'Tle', 'Probabilités conditionnelles, arbres et indépendance', 'question', 'Dans l’exemple de la fiche, P_D(C) vaut environ…', 'P(C ∩ D) = 0,010 et P(D) = 0,029. P_D(C) vaut environ…'),
  (22, 'physique-chimie-maths', '1re', 'Dérivation', 'question', 'Pour cette fonction, où f’ s’annule-t-elle ?', 'Pour f(x) = x³ − 3x² + 1, où f’ s’annule-t-elle ?'),
  (23, 'si', 'Tle', 'Projet et démarche d’ingénieur', 'question', 'Combien de phases couvre l’analyse du cycle de vie dans le cours ?', 'Combien de phases l’analyse du cycle de vie d’un produit couvre-t-elle ?');

-- Les cours, une correction à la fois (plusieurs peuvent viser la même leçon).
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ = 'cours' ORDER BY n LOOP
    UPDATE public.lessons l SET content = replace(l.content, k.ancien, k.nouveau)
      FROM public.subjects s
      JOIN public.chapters c ON c.subject_id = s.id
     WHERE s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND l.chapter_id = c.id AND strpos(l.content, k.ancien) > 0;
  END LOOP;
END $$;

-- Les questions de quiz (énoncé, explication, options), une correction à la fois.
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ <> 'cours' ORDER BY n LOOP
    UPDATE public.quiz_questions x
       SET question    = CASE WHEN k.champ = 'question'    THEN replace(x.question, k.ancien, k.nouveau) ELSE x.question END,
           explanation = CASE WHEN k.champ = 'explication' THEN replace(x.explanation, k.ancien, k.nouveau) ELSE x.explanation END,
           options     = CASE WHEN k.champ = 'options'     THEN replace(x.options::text, k.ancien, k.nouveau)::jsonb ELSE x.options END
      FROM public.quizzes qz
      JOIN public.lessons l ON l.id = qz.lesson_id
      JOIN public.chapters c ON c.id = l.chapter_id
      JOIN public.subjects s ON s.id = c.subject_id
     WHERE x.quiz_id = qz.id AND s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND strpos(CASE k.champ WHEN 'question' THEN x.question WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.ancien) > 0;
  END LOOP;
END $$;

-- Contrôle d’arrivée : chaque correction doit voir son texte juste en place.
DO $$
DECLARE n_absentes int;
BEGIN
  SELECT count(*) INTO n_absentes FROM _corrections k
   WHERE NOT EXISTS (
     SELECT 1 FROM public.subjects s
       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter
       JOIN public.lessons l ON l.chapter_id = c.id
       LEFT JOIN public.quizzes qz ON qz.lesson_id = l.id
       LEFT JOIN public.quiz_questions x ON x.quiz_id = qz.id
      WHERE s.slug = k.slug
        AND strpos(CASE k.champ WHEN 'cours' THEN l.content WHEN 'question' THEN x.question
                   WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.nouveau) > 0);
  RAISE NOTICE 'Migration 460 : % correction(s) sur 23 introuvables.', n_absentes;
  IF n_absentes > 0 THEN
    RAISE WARNING 'Migration 460 : des corrections n''ont pas trouvé leur fiche (titre, niveau ou fragment changé ?).';
  END IF;
END $$;

DROP TABLE IF EXISTS pg_temp._corrections;
