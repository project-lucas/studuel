-- =============================================================================
-- Studuel — Migration 052 : quiz de leçon, SES lycée 2de·1re·Tle
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
--    de SES lycée (le niveau est porté par chaque ligne).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'SES', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 2de
  ('05200000-0000-4000-8000-000000000001'::uuid, '2de', 'Comment raisonnent les économistes ?', 'Comment raisonnent les économistes ?'),
  ('05200000-0000-4000-8000-000000000002'::uuid, '2de', 'La production',                        'La production'),
  ('05200000-0000-4000-8000-000000000003'::uuid, '2de', 'Comment se forment les prix ?',        'Comment se forment les prix ?'),
  ('05200000-0000-4000-8000-000000000004'::uuid, '2de', 'La socialisation',                     'La socialisation'),
  -- 1re
  ('05200000-0000-4000-8000-000000000005'::uuid, '1re', 'Le marché et ses défaillances',   'Le marché et ses défaillances'),
  ('05200000-0000-4000-8000-000000000006'::uuid, '1re', 'La monnaie et le financement',    'La monnaie et le financement'),
  ('05200000-0000-4000-8000-000000000007'::uuid, '1re', 'Socialisation et groupes sociaux', 'Socialisation et groupes sociaux'),
  ('05200000-0000-4000-8000-000000000008'::uuid, '1re', 'L''opinion publique',             'L''opinion publique'),
  -- Tle
  ('05200000-0000-4000-8000-000000000009'::uuid, 'Tle', 'Croissance et environnement',  'Croissance et environnement'),
  ('05200000-0000-4000-8000-000000000010'::uuid, 'Tle', 'Le commerce international',     'Le commerce international'),
  ('05200000-0000-4000-8000-000000000011'::uuid, 'Tle', 'Les mutations du travail',     'Les mutations du travail'),
  ('05200000-0000-4000-8000-000000000012'::uuid, 'Tle', 'La justice sociale',           'La justice sociale')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'ses'
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
  -- Quiz 1 — Comment raisonnent les économistes ?
  ('05210000-0000-4000-8000-000000000011'::uuid, '05200000-0000-4000-8000-000000000001'::uuid,
   'Qu''appelle-t-on un « coût d''opportunité » ?', 'mcq',
   '["La somme d''argent réellement dépensée", "Ce à quoi on renonce en faisant un choix plutôt qu''un autre", "Le coût de production d''un bien", "Le prix de vente affiché en magasin"]', 1,
   'Le coût d''opportunité mesure la valeur de la meilleure option à laquelle on renonce lorsqu''on fait un choix.', 1),
  ('05210000-0000-4000-8000-000000000012'::uuid, '05200000-0000-4000-8000-000000000001'::uuid,
   'La rareté des ressources oblige les agents économiques à faire des choix.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les besoins étant illimités et les ressources limitées, l''économie étudie comment on arbitre ces choix.', 2),
  ('05210000-0000-4000-8000-000000000013'::uuid, '05200000-0000-4000-8000-000000000001'::uuid,
   'Comment nomme-t-on l''hypothèse selon laquelle l''agent économique cherche à maximiser sa satisfaction ?', 'mcq',
   '["L''altruisme", "Le hasard", "La rationalité", "La solidarité"]', 2,
   'L''homo œconomicus est supposé rationnel : il compare coûts et avantages pour maximiser son utilité.', 3),

  -- Quiz 2 — La production
  ('05210000-0000-4000-8000-000000000021'::uuid, '05200000-0000-4000-8000-000000000002'::uuid,
   'Quels sont les deux principaux facteurs de production ?', 'mcq',
   '["Le prix et la quantité", "L''offre et la demande", "Le travail et le capital", "L''épargne et la consommation"]', 2,
   'La production combine le facteur travail (main-d''œuvre) et le facteur capital (machines, locaux…).', 1),
  ('05210000-0000-4000-8000-000000000022'::uuid, '05200000-0000-4000-8000-000000000002'::uuid,
   'La valeur ajoutée d''une entreprise correspond à la valeur de sa production diminuée de ses consommations intermédiaires.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Valeur ajoutée = production − consommations intermédiaires ; sa somme dans l''économie forme le PIB.', 2),
  ('05210000-0000-4000-8000-000000000023'::uuid, '05200000-0000-4000-8000-000000000002'::uuid,
   'Qu''appelle-t-on gains de productivité ?', 'mcq',
   '["Une hausse des prix de vente", "Une augmentation de la production obtenue avec la même quantité de facteurs", "Une baisse du nombre de salariés", "Une hausse des impôts sur les sociétés"]', 1,
   'Les gains de productivité désignent une production plus efficace : produire plus (ou autant) avec moins de facteurs.', 3),

  -- Quiz 3 — Comment se forment les prix ?
  ('05210000-0000-4000-8000-000000000031'::uuid, '05200000-0000-4000-8000-000000000003'::uuid,
   'Sur un marché concurrentiel, comment se forme le prix d''équilibre ?', 'mcq',
   '["Il est fixé par l''État", "Il résulte de la rencontre entre l''offre et la demande", "Il est décidé par le seul vendeur", "Il dépend uniquement du coût de production"]', 1,
   'Le prix d''équilibre est celui qui égalise la quantité offerte et la quantité demandée sur le marché.', 1),
  ('05210000-0000-4000-8000-000000000032'::uuid, '05200000-0000-4000-8000-000000000003'::uuid,
   'Toutes choses égales par ailleurs, lorsque le prix d''un bien augmente, la quantité demandée tend à diminuer.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La courbe de demande est décroissante : plus le prix monte, moins les consommateurs achètent.', 2),
  ('05210000-0000-4000-8000-000000000033'::uuid, '05200000-0000-4000-8000-000000000003'::uuid,
   'Que se passe-t-il en cas d''excès d''offre par rapport à la demande à un prix donné ?', 'mcq',
   '["Le prix a tendance à augmenter", "Le prix reste toujours fixe", "Le prix a tendance à baisser", "La demande disparaît totalement"]', 2,
   'Un surplus d''offre (invendus) pousse les prix à la baisse jusqu''au retour à l''équilibre.', 3),

  -- Quiz 4 — La socialisation
  ('05210000-0000-4000-8000-000000000041'::uuid, '05200000-0000-4000-8000-000000000004'::uuid,
   'Qu''est-ce que la socialisation ?', 'mcq',
   '["Le processus d''apprentissage des normes et valeurs d''une société", "L''achat de biens de consommation", "La création d''une entreprise", "Le calcul du revenu d''un ménage"]', 0,
   'La socialisation est le processus par lequel un individu intériorise les normes, valeurs et rôles de sa société.', 1),
  ('05210000-0000-4000-8000-000000000042'::uuid, '05200000-0000-4000-8000-000000000004'::uuid,
   'La famille et l''école sont les principales instances de la socialisation primaire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La socialisation primaire, durant l''enfance, est assurée surtout par la famille et l''école.', 2),
  ('05210000-0000-4000-8000-000000000043'::uuid, '05200000-0000-4000-8000-000000000004'::uuid,
   'Comment appelle-t-on la distinction sociale entre le masculin et le féminin, construite par la socialisation ?', 'mcq',
   '["La classe sociale", "Le genre", "Le sexe biologique", "La génération"]', 1,
   'Le genre désigne les rôles et attentes sociales attachés au masculin et au féminin, résultat d''une socialisation différenciée.', 3),

  -- Quiz 5 — Le marché et ses défaillances
  ('05210000-0000-4000-8000-000000000051'::uuid, '05200000-0000-4000-8000-000000000005'::uuid,
   'Qu''est-ce qu''une externalité négative ?', 'mcq',
   '["Un impôt payé par l''entreprise", "Un effet négatif d''une activité sur des tiers, non pris en compte par le marché", "Une subvention accordée par l''État", "Un bénéfice partagé entre actionnaires"]', 1,
   'Une externalité négative (ex : la pollution) fait supporter un coût à des tiers sans compensation par le marché.', 1),
  ('05210000-0000-4000-8000-000000000052'::uuid, '05200000-0000-4000-8000-000000000005'::uuid,
   'Une situation de monopole correspond à un marché où un seul vendeur fait face à de nombreux acheteurs.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le monopole, forme de concurrence imparfaite, donne au vendeur unique un pouvoir de marché sur le prix.', 2),
  ('05210000-0000-4000-8000-000000000053'::uuid, '05200000-0000-4000-8000-000000000005'::uuid,
   'Un bien commun, comme une ressource halieutique, se caractérise par...', 'mcq',
   '["l''exclusion facile de tout usager", "la rivalité de la consommation et la difficulté d''exclure les usagers", "l''absence de tout usage possible", "une production réservée à l''État"]', 1,
   'Un bien commun est rival (l''usage de l''un réduit celui des autres) mais non excluable, d''où le risque de surexploitation.', 3),

  -- Quiz 6 — La monnaie et le financement
  ('05210000-0000-4000-8000-000000000061'::uuid, '05200000-0000-4000-8000-000000000006'::uuid,
   'Laquelle de ces propositions n''est PAS une fonction de la monnaie ?', 'mcq',
   '["Unité de compte", "Réserve de valeur", "Intermédiaire des échanges", "Facteur de production"]', 3,
   'La monnaie sert d''unité de compte, de réserve de valeur et d''intermédiaire des échanges, mais n''est pas un facteur de production.', 1),
  ('05210000-0000-4000-8000-000000000062'::uuid, '05200000-0000-4000-8000-000000000006'::uuid,
   'La monnaie est principalement créée par les banques commerciales lorsqu''elles accordent des crédits.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''essentiel de la création monétaire vient des crédits bancaires : « les crédits font les dépôts ».', 2),
  ('05210000-0000-4000-8000-000000000063'::uuid, '05200000-0000-4000-8000-000000000006'::uuid,
   'Qu''appelle-t-on financement direct ?', 'mcq',
   '["Un financement par un crédit bancaire", "Le recours aux marchés financiers (actions, obligations) sans intermédiaire bancaire", "Un don de l''État", "L''autofinancement par les bénéfices"]', 1,
   'Le financement direct met en relation prêteurs et emprunteurs sur les marchés (émission d''actions ou d''obligations).', 3),

  -- Quiz 7 — Socialisation et groupes sociaux
  ('05210000-0000-4000-8000-000000000071'::uuid, '05200000-0000-4000-8000-000000000007'::uuid,
   'Qu''est-ce qu''un groupe d''appartenance ?', 'mcq',
   '["Un groupe auquel l''individu appartient effectivement", "Un groupe auquel il aimerait ressembler sans en faire partie", "Un groupe imaginaire sans existence réelle", "Un groupe uniquement professionnel"]', 0,
   'Le groupe d''appartenance est celui dont l''individu fait réellement partie, par opposition au groupe de référence.', 1),
  ('05210000-0000-4000-8000-000000000072'::uuid, '05200000-0000-4000-8000-000000000007'::uuid,
   'La socialisation secondaire peut prolonger, mais aussi transformer, les dispositions acquises durant l''enfance.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À l''âge adulte (travail, couple…), la socialisation secondaire renforce ou reconfigure la socialisation primaire.', 2),
  ('05210000-0000-4000-8000-000000000073'::uuid, '05200000-0000-4000-8000-000000000007'::uuid,
   'Comment nomme-t-on un groupe auquel un individu s''identifie et dont il emprunte les valeurs sans forcément en faire partie ?', 'mcq',
   '["Le groupe primaire", "Le groupe de travail", "Le groupe de référence", "Le groupe domestique"]', 2,
   'Le groupe de référence sert de modèle : l''individu s''y réfère pour orienter ses comportements et aspirations.', 3),

  -- Quiz 8 — L'opinion publique
  ('05210000-0000-4000-8000-000000000081'::uuid, '05200000-0000-4000-8000-000000000008'::uuid,
   'À quoi sert principalement un sondage d''opinion ?', 'mcq',
   '["À fixer les prix du marché", "À mesurer, à partir d''un échantillon, les opinions d''une population", "À produire des biens", "À voter les lois"]', 1,
   'Le sondage estime l''opinion d''une population entière en interrogeant un échantillon représentatif.', 1),
  ('05210000-0000-4000-8000-000000000082'::uuid, '05200000-0000-4000-8000-000000000008'::uuid,
   'La formulation d''une question de sondage peut influencer les réponses obtenues.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''effet de formulation montre que la manière de poser la question oriente en partie les réponses.', 2),
  ('05210000-0000-4000-8000-000000000083'::uuid, '05200000-0000-4000-8000-000000000008'::uuid,
   'Quel acteur joue un rôle central dans la construction et la diffusion de l''opinion publique ?', 'mcq',
   '["Les médias", "Les usines", "Les banques centrales", "Les fournisseurs d''énergie"]', 0,
   'Les médias sélectionnent et hiérarchisent l''information (agenda), contribuant à façonner l''opinion publique.', 3),

  -- Quiz 9 — Croissance et environnement
  ('05210000-0000-4000-8000-000000000091'::uuid, '05200000-0000-4000-8000-000000000009'::uuid,
   'Que mesure principalement le PIB (produit intérieur brut) ?', 'mcq',
   '["Le bonheur de la population", "La richesse produite (somme des valeurs ajoutées) sur un territoire", "La quantité de pollution émise", "Le niveau des inégalités"]', 1,
   'Le PIB additionne les valeurs ajoutées produites : c''est un indicateur de production, non de bien-être.', 1),
  ('05210000-0000-4000-8000-000000000092'::uuid, '05200000-0000-4000-8000-000000000009'::uuid,
   'La croissance économique peut dégrader l''environnement lorsqu''elle épuise des ressources naturelles non renouvelables.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une croissance fondée sur l''exploitation intensive du capital naturel menace sa soutenabilité à long terme.', 2),
  ('05210000-0000-4000-8000-000000000093'::uuid, '05200000-0000-4000-8000-000000000009'::uuid,
   'Le progrès technique est considéré comme une source majeure de croissance économique parce qu''il...', 'mcq',
   '["réduit toujours l''emploi", "augmente la productivité et permet des innovations", "diminue la valeur ajoutée", "supprime le facteur capital"]', 1,
   'Le progrès technique améliore la productivité des facteurs et alimente une croissance dite endogène (innovation).', 3),

  -- Quiz 10 — Le commerce international
  ('05210000-0000-4000-8000-000000000101'::uuid, '05200000-0000-4000-8000-000000000010'::uuid,
   'À qui doit-on la théorie de l''avantage comparatif, qui justifie la spécialisation des pays ?', 'mcq',
   '["Karl Marx", "John Maynard Keynes", "David Ricardo", "Adam Smith"]', 2,
   'David Ricardo montre qu''un pays gagne à se spécialiser là où son désavantage est le plus faible (avantage comparatif).', 1),
  ('05210000-0000-4000-8000-000000000102'::uuid, '05200000-0000-4000-8000-000000000010'::uuid,
   'Le protectionnisme désigne l''ensemble des mesures visant à protéger la production nationale de la concurrence étrangère.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Droits de douane, quotas ou normes sont des outils protectionnistes qui limitent les importations.', 2),
  ('05210000-0000-4000-8000-000000000103'::uuid, '05200000-0000-4000-8000-000000000010'::uuid,
   'Qu''est-ce que le libre-échange ?', 'mcq',
   '["Une taxation élevée des importations", "La circulation des biens et services sans entraves douanières entre pays", "L''interdiction totale d''exporter", "La fixation des prix par l''État"]', 1,
   'Le libre-échange supprime les barrières aux échanges pour favoriser le commerce international.', 3),

  -- Quiz 11 — Les mutations du travail
  ('05210000-0000-4000-8000-000000000111'::uuid, '05200000-0000-4000-8000-000000000011'::uuid,
   'Comment définit-on le taux de chômage ?', 'mcq',
   '["La part des chômeurs dans la population totale", "La part des chômeurs dans la population active", "Le nombre d''emplois créés dans l''année", "La part des inactifs dans la population"]', 1,
   'Le taux de chômage rapporte le nombre de chômeurs à la population active (actifs occupés + chômeurs).', 1),
  ('05210000-0000-4000-8000-000000000112'::uuid, '05200000-0000-4000-8000-000000000011'::uuid,
   'La montée des contrats courts et du temps partiel illustre une forme de précarisation de l''emploi.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le développement des emplois atypiques (CDD, intérim, temps partiel subi) traduit une précarisation du travail.', 2),
  ('05210000-0000-4000-8000-000000000113'::uuid, '05200000-0000-4000-8000-000000000011'::uuid,
   'Comment appelle-t-on la division du travail poussée à l''extrême, avec des tâches parcellisées à la chaîne ?', 'mcq',
   '["Le télétravail", "L''économie collaborative", "Le taylorisme", "La flexisécurité"]', 2,
   'Le taylorisme (organisation scientifique du travail) découpe la production en tâches simples et répétitives.', 3),

  -- Quiz 12 — La justice sociale
  ('05210000-0000-4000-8000-000000000121'::uuid, '05200000-0000-4000-8000-000000000012'::uuid,
   'Quelle différence y a-t-il entre égalité et équité ?', 'mcq',
   '["Aucune, ce sont des synonymes", "L''égalité traite tout le monde à l''identique, l''équité tient compte des situations pour les corriger", "L''équité consiste à supprimer les impôts", "L''égalité concerne seulement les revenus élevés"]', 1,
   'L''égalité applique un traitement identique ; l''équité adapte le traitement aux situations pour réduire les inégalités.', 1),
  ('05210000-0000-4000-8000-000000000122'::uuid, '05200000-0000-4000-8000-000000000012'::uuid,
   'La redistribution, par les impôts et les prestations sociales, vise à réduire les inégalités de revenus.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Prélèvements progressifs et transferts sociaux corrigent la répartition primaire des revenus pour plus de justice sociale.', 2),
  ('05210000-0000-4000-8000-000000000123'::uuid, '05200000-0000-4000-8000-000000000012'::uuid,
   'Comment nomme-t-on des mesures qui traitent différemment certains groupes pour compenser des inégalités de départ ?', 'mcq',
   '["La flat tax", "Le libre-échange", "L''austérité budgétaire", "La discrimination positive"]', 3,
   'La discrimination positive accorde un traitement favorable à des groupes désavantagés pour rétablir l''égalité des chances.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Vérification (facultatif, après le Run) :
--   SELECT q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '05200000-%' GROUP BY q.title;
-- =============================================================================
