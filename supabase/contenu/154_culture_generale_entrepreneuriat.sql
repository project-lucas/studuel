-- =============================================================================
-- Studuel — Migration 154 : Culture générale — Entrepreneuriat
--
-- Nouveau THÈME « Entrepreneuriat » dans le dossier hors-programme « Culture
-- générale » (subject 'culture-generale', déjà créé par 150). Esprit « cours
-- d'école de commerce (HEC) » rendu accessible aux lycéens et étudiants : de
-- l'idée à la levée de fonds, en passant par le business model et le MVP.
-- On NE recrée PAS le subject ni la contrainte subjects_category_check : ils
-- sont posés par la migration 150.
--
-- PRÉREQUIS : 150 (subject 'culture-generale' + colonne fixed_level).
-- Idempotent (ON CONFLICT / gardes NOT EXISTS).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Thème « Entrepreneuriat » (chapitre au niveau fixe « tous », position 4).
-- -----------------------------------------------------------------------------
INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, 'tous', 'Entrepreneuriat', 4
FROM public.subjects s WHERE s.slug = 'culture-generale'
ON CONFLICT (subject_id, level, title) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. Leçons du thème (cours dans lessons.content).
-- -----------------------------------------------------------------------------
INSERT INTO public.lessons (chapter_id, title, content, position)
SELECT c.id, v.title, v.md, v.pos
FROM (VALUES
  ('Trouver une idée et un problème à résoudre', $md$# Trouver une idée et un problème à résoudre

## 1. Une bonne idée n'est pas une idée « géniale »
On imagine souvent l'entrepreneur comme un génie frappé par une idée révolutionnaire. La réalité est plus terre-à-terre : une bonne idée, c'est d'abord une idée qui **résout un vrai problème** pour de vraies personnes. Sans problème réel, même l'idée la plus brillante ne trouvera jamais de clients.

## 2. Le « pain point »
En anglais, on appelle **pain point** (littéralement « point de douleur ») un problème concret qui **agace, coûte du temps ou de l'argent** à quelqu'un. Plus la douleur est forte et fréquente, plus les gens sont prêts à payer pour la faire disparaître.

> Exemple : avant les plateformes de VTC, héler un taxi le soir sous la pluie était pénible. Le pain point était clair — et la solution s'est vendue toute seule.

## 3. Partir du besoin, pas de la techno
L'erreur classique du débutant est de **tomber amoureux de sa solution** (une appli, une technologie, un gadget) avant d'avoir vérifié que le problème existe. La bonne démarche est inverse :

1. Observer une **frustration** récurrente autour de soi.
2. Comprendre **qui** la vit et **à quel point** elle dérange.
3. Seulement ensuite, imaginer une solution.

Une formule résume tout : *« Fall in love with the problem, not the solution »* — « Tombe amoureux du problème, pas de la solution ». Le problème reste stable ; la solution, elle, peut changer dix fois.

## 4. La proposition de valeur
La **proposition de valeur** (en anglais *value proposition*) est la promesse claire que fait ton projet : **à qui** tu t'adresses, **quel problème** tu résous et **pourquoi** ta réponse est meilleure que les autres. On peut la tester en une phrase : « J'aide [tel client] à [résoudre tel problème] grâce à [ma solution]. »

## 5. Valider avant de foncer
Avant d'investir des mois de travail, on **valide** l'idée : parler à de vrais utilisateurs, observer s'ils ont déjà bricolé une solution, vérifier qu'ils seraient prêts à payer. Une idée qui n'intéresse personne à qui on la présente est un signal d'alarme précieux… et gratuit.

## L'essentiel à retenir
- Une bonne idée **résout un vrai problème** (un **pain point**), pas juste une idée « cool ».
- On part du **besoin**, jamais de la technologie.
- *« Fall in love with the problem, not the solution »*.
- La **proposition de valeur** dit à qui, quel problème et pourquoi c'est mieux.
- On **valide** l'idée en parlant aux clients avant de tout construire.$md$, 1),

  ('Le business model', $md$# Le business model

## 1. Qu'est-ce qu'un business model ?
Un **business model** (ou modèle économique) décrit **comment une entreprise crée de la valeur** pour ses clients **et** comment elle **capte** une partie de cette valeur sous forme de revenus. Avoir un bon produit ne suffit pas : encore faut-il savoir **comment gagner de l'argent** avec.

> Créer de la valeur = rendre un service utile. Capter la valeur = se faire payer pour ce service.

## 2. Le Business Model Canvas
Pour clarifier tout cela, on utilise souvent le **Business Model Canvas** : un tableau d'une page qui découpe l'entreprise en blocs. Les plus importants pour débuter :

- **Segments de clients** : à qui on s'adresse (quel public précis).
- **Proposition de valeur** : le problème qu'on résout, la promesse faite.
- **Canaux** : comment on atteint et livre les clients (site, boutique, appli…).
- **Relations clients** : comment on les attire et les fidélise.
- **Sources de revenus** : d'où vient l'argent (ventes, abonnements…).
- **Ressources et activités clés** : ce qu'il faut avoir et faire pour fonctionner.
- **Partenaires clés** : les alliés indispensables (fournisseurs, plateformes).
- **Structure de coûts** : les principales dépenses.

L'intérêt : voir **d'un coup d'œil** si le projet tient debout, sur une seule feuille.

## 3. Quelques modèles de revenus classiques
Il existe plusieurs façons de **capter** la valeur. Les plus courantes :

- **Abonnement** : le client paie régulièrement (chaque mois) pour un accès continu — c'est le modèle des plateformes de streaming.
- **Freemium** : une base **gratuite** pour attirer un maximum d'utilisateurs, et des fonctions **payantes** (*premium*) pour ceux qui veulent plus.
- **Marketplace** (place de marché) : on met en relation des vendeurs et des acheteurs et on prend une **commission** sur chaque transaction.
- **Publicité** : le service est gratuit pour l'utilisateur, et ce sont les **annonceurs** qui paient pour être vus.

## 4. Le même produit, plusieurs modèles
Une même idée peut se monétiser de plusieurs manières. Un logiciel peut être vendu une fois, loué par abonnement, ou offert gratuitement avec de la publicité. **Choisir le bon modèle** fait souvent la différence entre un projet qui survit et un projet qui décolle.

## L'essentiel à retenir
- Le **business model** = comment on **crée** ET **capte** de la valeur (gagne de l'argent).
- Le **Business Model Canvas** résume l'entreprise sur une page : clients, proposition de valeur, revenus, coûts, canaux…
- Modèles courants : **abonnement**, **freemium**, **marketplace**, **publicité**.
- Un même produit peut adopter des modèles différents : le choix est stratégique.$md$, 2),

  ('Le MVP : tester avant de tout construire', $md$# Le MVP : tester avant de tout construire

## 1. Qu'est-ce qu'un MVP ?
**MVP** signifie *Minimum Viable Product*, en français **produit minimum viable**. C'est la **version la plus simple** de ton produit qui permet déjà de **tester une hypothèse** auprès de vrais utilisateurs. Pas la version parfaite : juste ce qu'il faut pour vérifier si l'idée intéresse quelqu'un.

> Idée clé : dépenser le **minimum d'effort** pour apprendre le **maximum** sur ce que veulent les clients.

## 2. Pourquoi ne pas tout construire d'un coup ?
Passer un an à développer un produit complet **avant** de le montrer, c'est jouer très gros : si personne n'en veut, tout ce travail est perdu. Le MVP inverse la logique — on montre vite une version imparfaite pour **échouer vite et pas cher** (*fail fast*), corriger, et recommencer.

## 3. La démarche « lean startup »
Le MVP est au cœur de la méthode **lean startup** (« startup au plus juste »), popularisée par Eric Ries. Son cœur est une boucle : **Build – Measure – Learn** (« Construire – Mesurer – Apprendre ») :

1. **Construire** un petit MVP.
2. **Mesurer** comment les utilisateurs réagissent (données réelles).
3. **Apprendre** de ces retours, puis recommencer en améliorant.

On répète cette boucle : c'est ce qu'on appelle **itérer**. À chaque tour, le produit se rapproche de ce que veulent vraiment les clients.

## 4. Parler aux clients avant de coder
Un MVP n'est pas forcément un logiciel. Cela peut être :

- une simple **page web** qui décrit le produit pour voir si des gens s'inscrivent ;
- une **maquette** cliquable présentée à des utilisateurs ;
- un service rendu **à la main** en coulisses, avant de l'automatiser.

Le réflexe fondamental : **parler aux clients** et observer leurs vrais comportements **avant** de dépenser du temps à tout coder.

## 5. Le piège de la perfection
Beaucoup de projets meurent parce que leurs fondateurs peaufinent des détails que **personne** ne leur a demandés. Le MVP protège de ce piège : il force à sortir tôt, à confronter l'idée au réel, et à laisser les **retours des clients** guider la suite plutôt que ses propres suppositions.

## L'essentiel à retenir
- **MVP** = *Minimum Viable Product*, le **produit minimum viable** qui teste une hypothèse.
- Objectif : **minimum d'effort** pour un **maximum d'apprentissage** ; **échouer vite et pas cher**.
- Méthode **lean startup** : boucle **Build – Measure – Learn** qu'on **itère**.
- On **parle aux clients avant de coder** ; on fuit le piège de la perfection.$md$, 3),

  ('Financer et pitcher son projet', $md$# Financer et pitcher son projet

## 1. D'où vient l'argent pour démarrer ?
Créer une entreprise demande souvent de l'argent avant qu'elle n'en rapporte. Il existe plusieurs sources de financement, du plus proche au plus « pro » :

- **Bootstrapping** : se financer par ses **fonds propres** et les premiers revenus, sans investisseur extérieur. Avantage : on garde le contrôle total. Limite : la croissance est plus lente.
- **Love money** : l'argent de la **famille et des amis** qui croient au projet.
- **Business angels** : des particuliers fortunés qui investissent leur propre argent **et** leur expérience dans de jeunes entreprises.
- **Capital-risque** (*venture capital*, ou **VC**) : des fonds professionnels qui investissent de grosses sommes dans des startups à fort potentiel, en échange d'une **part du capital** (des actions).

## 2. Qu'est-ce qu'une levée de fonds ?
Faire une **levée de fonds**, c'est **vendre une partie de son entreprise** (des parts) à des investisseurs en échange d'argent pour se développer. On ne rembourse pas cet argent comme un prêt : l'investisseur devient **copropriétaire** et gagnera si l'entreprise prend de la valeur. En échange, le fondateur accepte de **partager** son capital.

## 3. Le pitch
Pour convaincre des investisseurs, il faut **pitcher** : présenter son projet de façon claire et percutante. Un bon **pitch** répond en général à ces questions :

- **Problème** : quel vrai problème résous-tu ?
- **Solution** : comment y réponds-tu ?
- **Marché** : combien de personnes sont concernées (la taille du marché) ?
- **Équipe** : pourquoi *vous* êtes les bonnes personnes pour réussir ?
- **Traction** : quelles preuves que ça marche déjà (premiers clients, ventes, croissance) ?
- **La demande** : combien d'argent tu cherches et pour quoi faire.

La **traction** est souvent décisive : montrer que des clients utilisent déjà le produit rassure bien plus qu'une belle promesse.

## 4. L'elevator pitch
L'**elevator pitch** (« argumentaire d'ascenseur ») est la version ultra-courte : présenter son projet en **30 secondes à une minute**, le temps d'un trajet en ascenseur. L'idée : si tu croises un investisseur, tu dois pouvoir donner envie d'en savoir plus **avant qu'il ne sorte**. Un bon elevator pitch est simple, concret et mémorable.

## L'essentiel à retenir
- Financer : **bootstrapping** (fonds propres), **love money**, **business angels**, **capital-risque (VC)**.
- Une **levée de fonds** échange des **parts** de l'entreprise contre de l'argent (pas un prêt).
- Un **pitch** couvre : problème, solution, marché, équipe, **traction**, demande.
- L'**elevator pitch** résume le projet en moins d'une minute.$md$, 4)
) AS v(title, md, pos)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Entrepreneuriat'
ON CONFLICT (chapter_id, title) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. Un quiz par leçon (rattaché via lesson_id), seulement si la leçon n'en a
--    pas déjà un. Quiz gratuits (culture générale accessible à tous).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Culture générale', 'tous', 'Entrepreneuriat', true, l.id
FROM (VALUES
  ('15419999-0000-4000-8000-000000000001'::uuid, 'Idée & problème', 'Trouver une idée et un problème à résoudre'),
  ('15419999-0000-4000-8000-000000000002'::uuid, 'Business model', 'Le business model'),
  ('15419999-0000-4000-8000-000000000003'::uuid, 'Le MVP', 'Le MVP : tester avant de tout construire'),
  ('15419999-0000-4000-8000-000000000004'::uuid, 'Financer & pitcher', 'Financer et pitcher son projet')
) AS v(quiz_id, title, lesson)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Entrepreneuriat'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = v.lesson
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. Questions (10 par quiz), attachées au quiz de la leçon via la jointure.
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Idée & problème (CC = 01)
  ('15410000-0000-4000-8000-000000000101'::uuid, 'Trouver une idée et un problème à résoudre',
   'Qu''est-ce qu''une bonne idée d''entreprise avant tout ?', 'mcq',
   '["Une idée qui résout un vrai problème", "Une idée qui utilise la dernière technologie", "Une idée que personne n''a jamais eue", "Une idée compliquée à copier"]', 0,
   'Sans vrai problème à résoudre, même une idée brillante ne trouve pas de clients.', 1),
  ('15410000-0000-4000-8000-000000000102'::uuid, 'Trouver une idée et un problème à résoudre',
   'Que désigne un « pain point » ?', 'mcq',
   '["Un problème concret qui agace, coûte du temps ou de l''argent", "Une douleur physique", "Un point de vente", "Un bénéfice de l''entreprise"]', 0,
   'Un pain point est une frustration réelle ; plus elle est forte, plus on est prêt à payer pour la résoudre.', 2),
  ('15410000-0000-4000-8000-000000000103'::uuid, 'Trouver une idée et un problème à résoudre',
   'Selon la bonne démarche, de quoi doit-on partir ?', 'mcq',
   '["Du besoin (le problème)", "De la technologie", "De la solution", "Du logo de la marque"]', 0,
   'On part du besoin réel, jamais de la techno ou de la solution.', 3),
  ('15410000-0000-4000-8000-000000000104'::uuid, 'Trouver une idée et un problème à résoudre',
   'Que signifie « Fall in love with the problem, not the solution » ?', 'mcq',
   '["Tomber amoureux du problème, pas de la solution", "Tomber amoureux de la solution", "Aimer résoudre les problèmes des autres", "Ne jamais changer d''idée"]', 0,
   'Le problème reste stable, la solution peut changer : il faut se concentrer sur le problème.', 4),
  ('15410000-0000-4000-8000-000000000105'::uuid, 'Trouver une idée et un problème à résoudre',
   'Que décrit la « proposition de valeur » ?', 'mcq',
   '["À qui on s''adresse, quel problème on résout et pourquoi c''est mieux", "Le prix de vente uniquement", "Le montant des impôts", "La valeur des actions"]', 0,
   'La proposition de valeur est la promesse claire faite au client.', 5),
  ('15410000-0000-4000-8000-000000000106'::uuid, 'Trouver une idée et un problème à résoudre',
   'Quelle est l''erreur classique du débutant ?', 'mcq',
   '["Tomber amoureux de sa solution avant de vérifier le problème", "Parler aux clients trop tôt", "Choisir un problème trop grave", "Tester son idée gratuitement"]', 0,
   'On s''attache à sa solution sans avoir vérifié que le problème existe vraiment.', 6),
  ('15410000-0000-4000-8000-000000000107'::uuid, 'Trouver une idée et un problème à résoudre',
   'Comment valider une idée avant d''investir des mois de travail ?', 'mcq',
   '["Parler à de vrais utilisateurs et voir s''ils paieraient", "Coder tout de suite le produit final", "Attendre d''avoir beaucoup d''argent", "Garder l''idée secrète pour toujours"]', 0,
   'Valider, c''est confronter l''idée à de vrais clients avant de tout construire.', 7),
  ('15410000-0000-4000-8000-000000000108'::uuid, 'Trouver une idée et un problème à résoudre',
   'Plus un pain point est fort et fréquent, plus les gens sont prêts à payer pour le résoudre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : l''intensité et la fréquence de la douleur augmentent la valeur d''une solution.', 8),
  ('15410000-0000-4000-8000-000000000109'::uuid, 'Trouver une idée et un problème à résoudre',
   'Une idée qui n''intéresse personne quand on la présente est…', 'mcq',
   '["un signal d''alarme précieux et gratuit", "forcément une réussite", "un secret à protéger", "sans importance"]', 0,
   'C''est un retour gratuit qui évite de perdre des mois sur une fausse bonne idée.', 9),
  ('15410000-0000-4000-8000-000000000110'::uuid, 'Trouver une idée et un problème à résoudre',
   'Une bonne idée doit obligatoirement reposer sur une technologie révolutionnaire.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : ce qui compte est le problème résolu, pas la technologie employée.', 10),

  -- Business model (CC = 02)
  ('15410000-0000-4000-8000-000000000201'::uuid, 'Le business model',
   'Que décrit un business model ?', 'mcq',
   '["Comment l''entreprise crée ET capte de la valeur", "Uniquement le logo et le nom", "Le nombre d''employés", "La couleur du produit"]', 0,
   'Le modèle économique explique comment on rend service ET comment on gagne de l''argent.', 1),
  ('15410000-0000-4000-8000-000000000202'::uuid, 'Le business model',
   'Que signifie « capter de la valeur » ?', 'mcq',
   '["Se faire payer pour le service rendu", "Rendre un service gratuit", "Baisser ses prix", "Emprunter de l''argent"]', 0,
   'Créer de la valeur = rendre service ; capter la valeur = en tirer des revenus.', 2),
  ('15410000-0000-4000-8000-000000000203'::uuid, 'Le business model',
   'Qu''est-ce que le Business Model Canvas ?', 'mcq',
   '["Un tableau d''une page qui découpe l''entreprise en blocs", "Un logiciel de comptabilité", "Un contrat de vente", "Un type de publicité"]', 0,
   'Le Canvas résume clients, proposition de valeur, revenus, coûts, canaux… sur une seule feuille.', 3),
  ('15410000-0000-4000-8000-000000000204'::uuid, 'Le business model',
   'Lequel de ces éléments fait partie du Business Model Canvas ?', 'mcq',
   '["Les sources de revenus", "La météo", "Le signe astrologique du fondateur", "La couleur préférée du client"]', 0,
   'Les sources de revenus sont un bloc clé du Canvas.', 4),
  ('15410000-0000-4000-8000-000000000205'::uuid, 'Le business model',
   'Dans le modèle « abonnement », le client…', 'mcq',
   '["paie régulièrement pour un accès continu", "paie une seule fois pour toujours", "ne paie jamais", "paie uniquement s''il gagne"]', 0,
   'C''est le modèle des plateformes de streaming : un paiement récurrent.', 5),
  ('15410000-0000-4000-8000-000000000206'::uuid, 'Le business model',
   'En quoi consiste le modèle « freemium » ?', 'mcq',
   '["Une base gratuite et des fonctions payantes premium", "Tout est payant dès le départ", "Tout est gratuit pour toujours", "On paie pour s''inscrire seulement"]', 0,
   'Freemium = free (gratuit) + premium : on attire avec le gratuit, on monétise le premium.', 6),
  ('15410000-0000-4000-8000-000000000207'::uuid, 'Le business model',
   'Comment une marketplace gagne-t-elle de l''argent ?', 'mcq',
   '["En prenant une commission sur les transactions", "En vendant ses propres usines", "En interdisant les vendeurs", "En supprimant les acheteurs"]', 0,
   'Une place de marché met en relation vendeurs et acheteurs et prélève une commission.', 7),
  ('15410000-0000-4000-8000-000000000208'::uuid, 'Le business model',
   'Dans le modèle « publicité », qui paie principalement ?', 'mcq',
   '["Les annonceurs", "Uniquement l''utilisateur", "L''État", "Les concurrents"]', 0,
   'Le service est gratuit pour l''utilisateur ; ce sont les annonceurs qui paient pour être vus.', 8),
  ('15410000-0000-4000-8000-000000000209'::uuid, 'Le business model',
   'Un même produit peut-il être monétisé avec plusieurs business models différents ?', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : un logiciel peut être vendu, loué par abonnement ou offert avec publicité.', 9),
  ('15410000-0000-4000-8000-000000000210'::uuid, 'Le business model',
   'Avoir un bon produit suffit toujours à gagner de l''argent, sans réfléchir au modèle.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : encore faut-il savoir comment capter la valeur — c''est le rôle du business model.', 10),

  -- Le MVP (CC = 03)
  ('15410000-0000-4000-8000-000000000301'::uuid, 'Le MVP : tester avant de tout construire',
   'Que signifie l''abréviation MVP ?', 'mcq',
   '["Minimum Viable Product (produit minimum viable)", "Most Valuable Player", "Marché à Valeur Publique", "Modèle de Vente Professionnel"]', 0,
   'MVP = Minimum Viable Product, la version la plus simple qui teste une hypothèse.', 1),
  ('15410000-0000-4000-8000-000000000302'::uuid, 'Le MVP : tester avant de tout construire',
   'Quel est l''objectif principal d''un MVP ?', 'mcq',
   '["Un minimum d''effort pour un maximum d''apprentissage", "Livrer le produit parfait dès le départ", "Impressionner avec des fonctions inutiles", "Éviter de parler aux clients"]', 0,
   'On dépense le moins possible pour apprendre le plus possible sur les vrais besoins.', 2),
  ('15410000-0000-4000-8000-000000000303'::uuid, 'Le MVP : tester avant de tout construire',
   'Pourquoi éviter de tout construire d''un coup avant de montrer le produit ?', 'mcq',
   '["Parce que si personne n''en veut, tout le travail est perdu", "Parce que c''est interdit", "Parce que les clients détestent les nouveautés", "Parce qu''il faut d''abord lever des fonds"]', 0,
   'Le MVP permet d''échouer vite et pas cher plutôt que de risquer un an de travail inutile.', 3),
  ('15410000-0000-4000-8000-000000000304'::uuid, 'Le MVP : tester avant de tout construire',
   'À quelle méthode le MVP est-il associé ?', 'mcq',
   '["Le lean startup", "Le taylorisme", "Le protectionnisme", "Le monétarisme"]', 0,
   'Le MVP est au cœur de la méthode lean startup popularisée par Eric Ries.', 4),
  ('15410000-0000-4000-8000-000000000305'::uuid, 'Le MVP : tester avant de tout construire',
   'Quelle est la boucle centrale du lean startup ?', 'mcq',
   '["Build – Measure – Learn (Construire – Mesurer – Apprendre)", "Acheter – Vendre – Répéter", "Copier – Coller – Publier", "Planifier – Attendre – Espérer"]', 0,
   'On construit un MVP, on mesure les réactions, on apprend, puis on recommence.', 5),
  ('15410000-0000-4000-8000-000000000306'::uuid, 'Le MVP : tester avant de tout construire',
   'Que veut dire « itérer » dans cette démarche ?', 'mcq',
   '["Répéter la boucle en améliorant à chaque tour", "Abandonner au premier échec", "Coder plus vite", "Copier un concurrent"]', 0,
   'Chaque itération rapproche le produit de ce que veulent vraiment les clients.', 6),
  ('15410000-0000-4000-8000-000000000307'::uuid, 'Le MVP : tester avant de tout construire',
   'Un MVP est-il forcément un logiciel complet ?', 'mcq',
   '["Non : ce peut être une page web, une maquette ou un service manuel", "Oui, toujours une appli finie", "Oui, avec toutes les fonctions", "Non, ce doit être un objet physique"]', 0,
   'Un MVP peut être une simple page de test ou un service rendu à la main en coulisses.', 7),
  ('15410000-0000-4000-8000-000000000308'::uuid, 'Le MVP : tester avant de tout construire',
   'Quel réflexe fondamental le MVP encourage-t-il ?', 'mcq',
   '["Parler aux clients avant de tout coder", "Coder d''abord, montrer plus tard", "Garder l''idée secrète", "Peaufiner chaque détail avant de sortir"]', 0,
   'On observe les vrais comportements des clients avant d''investir dans le développement.', 8),
  ('15410000-0000-4000-8000-000000000309'::uuid, 'Le MVP : tester avant de tout construire',
   'Que signifie « échouer vite et pas cher » (fail fast) ?', 'mcq',
   '["Détecter tôt et à moindre coût ce qui ne marche pas", "Faire faillite rapidement", "Renoncer à toute ambition", "Baisser la qualité volontairement"]', 0,
   'Échouer vite permet de corriger rapidement sans avoir tout investi.', 9),
  ('15410000-0000-4000-8000-000000000310'::uuid, 'Le MVP : tester avant de tout construire',
   'Passer un an à peaufiner le produit avant de le montrer est la meilleure stratégie.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : c''est justement le piège de la perfection que le MVP permet d''éviter.', 10),

  -- Financer & pitcher (CC = 04)
  ('15410000-0000-4000-8000-000000000401'::uuid, 'Financer et pitcher son projet',
   'Qu''est-ce que le « bootstrapping » ?', 'mcq',
   '["Se financer par ses fonds propres, sans investisseur extérieur", "Emprunter à une grande banque", "Vendre toute son entreprise", "Attendre une subvention publique"]', 0,
   'Le bootstrapping garde le contrôle total mais rend la croissance plus lente.', 1),
  ('15410000-0000-4000-8000-000000000402'::uuid, 'Financer et pitcher son projet',
   'Que désigne la « love money » ?', 'mcq',
   '["L''argent de la famille et des amis", "Un prêt bancaire", "L''argent d''un fonds professionnel", "Une aide de l''État"]', 0,
   'La love money vient des proches qui croient au projet.', 2),
  ('15410000-0000-4000-8000-000000000403'::uuid, 'Financer et pitcher son projet',
   'Qui sont les « business angels » ?', 'mcq',
   '["Des particuliers fortunés qui investissent leur argent et leur expérience", "Des employés bénévoles", "Des banques centrales", "Des clients fidèles"]', 0,
   'Les business angels apportent capital et expérience aux jeunes entreprises.', 3),
  ('15410000-0000-4000-8000-000000000404'::uuid, 'Financer et pitcher son projet',
   'Que désigne le capital-risque (venture capital, VC) ?', 'mcq',
   '["Des fonds pro qui investissent dans des startups à fort potentiel contre des parts", "Un prêt sans intérêt", "Une assurance-vie", "Un impôt sur les startups"]', 0,
   'Les VC misent de grosses sommes sur des startups en échange d''actions.', 4),
  ('15410000-0000-4000-8000-000000000405'::uuid, 'Financer et pitcher son projet',
   'Qu''est-ce qu''une levée de fonds ?', 'mcq',
   '["Vendre des parts de l''entreprise à des investisseurs contre de l''argent", "Emprunter à rembourser avec intérêts", "Augmenter les prix de vente", "Licencier des employés"]', 0,
   'L''investisseur devient copropriétaire ; ce n''est pas un prêt à rembourser.', 5),
  ('15410000-0000-4000-8000-000000000406'::uuid, 'Financer et pitcher son projet',
   'Lors d''une levée de fonds, l''argent reçu…', 'mcq',
   '["ne se rembourse pas comme un prêt : l''investisseur devient copropriétaire", "doit être remboursé chaque mois", "est offert sans contrepartie", "appartient à l''État"]', 0,
   'En échange, le fondateur partage une part de son capital.', 6),
  ('15410000-0000-4000-8000-000000000407'::uuid, 'Financer et pitcher son projet',
   'Que veut dire « pitcher » son projet ?', 'mcq',
   '["Le présenter de façon claire et percutante", "Le vendre au plus offrant", "Le breveter", "Le garder secret"]', 0,
   'Le pitch sert à convaincre, notamment des investisseurs.', 7),
  ('15410000-0000-4000-8000-000000000408'::uuid, 'Financer et pitcher son projet',
   'Lequel de ces éléments fait partie d''un bon pitch ?', 'mcq',
   '["La traction (preuves que ça marche déjà)", "La couleur du bureau", "Le nom de famille du fondateur", "La météo du jour"]', 0,
   'Un bon pitch couvre problème, solution, marché, équipe, traction et demande.', 8),
  ('15410000-0000-4000-8000-000000000409'::uuid, 'Financer et pitcher son projet',
   'Que désigne la « traction » d''un projet ?', 'mcq',
   '["Les preuves concrètes que ça marche déjà (clients, ventes, croissance)", "La force physique de l''équipe", "Le budget publicitaire", "Le nombre de concurrents"]', 0,
   'La traction rassure bien plus qu''une simple promesse.', 9),
  ('15410000-0000-4000-8000-000000000410'::uuid, 'Financer et pitcher son projet',
   'Qu''est-ce qu''un « elevator pitch » ?', 'mcq',
   '["Une présentation de 30 s à 1 min, le temps d''un trajet en ascenseur", "Un contrat de financement", "Un ascenseur d''entreprise", "Un tableau de bord financier"]', 0,
   'L''elevator pitch doit donner envie d''en savoir plus en moins d''une minute.', 10)
) AS d(id, lesson, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Entrepreneuriat'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = d.lesson
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
