-- =============================================================================
-- Studuel — Migration 152 : Culture générale — Finances personnelles
--
-- Nouveau THÈME « Finances personnelles » dans le dossier hors-programme
-- « Culture générale » (créé en 150). Le dossier est présenté dans Réviser
-- comme une matière hors-niveau : ses thèmes/chapitres vivent au niveau fixe
-- « tous » et s'affichent pour toutes les classes (6e→Tle).
--   - On NE recrée PAS le subject « culture-generale » ni la contrainte de
--     catégorie : déjà faits en 150.
--   - Thème « Finances personnelles » = gérer son argent au quotidien
--     (budget, épargne, intérêts composés, crédit, investissement) — culture
--     générale utile, HORS programme scolaire, à visée pédagogique et non un
--     conseil financier personnalisé.
--
-- PRÉREQUIS : 150 (subject culture-generale + colonne fixed_level + contrainte).
-- Idempotent (ON CONFLICT / IS DISTINCT FROM / gardes NOT EXISTS).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Thème « Finances personnelles » (chapitre au niveau fixe « tous »).
-- -----------------------------------------------------------------------------
INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, 'tous', 'Finances personnelles', 2
FROM public.subjects s WHERE s.slug = 'culture-generale'
ON CONFLICT (subject_id, level, title) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. Leçons du thème (cours dans lessons.content).
-- -----------------------------------------------------------------------------
INSERT INTO public.lessons (chapter_id, title, content, position)
SELECT c.id, v.title, v.md, v.pos
FROM (VALUES
  ('Faire un budget et épargner', $md$# Faire un budget et épargner

## Pourquoi faire un budget ?
Un **budget**, c'est simplement un plan : combien d'argent entre, combien sort, et où il va. Sans budget, l'argent « disparaît » sans qu'on sache comment. Avec un budget, c'est toi qui décides.

## 1. Revenus et dépenses
Tout commence par deux colonnes :
- Les **revenus** : ce que tu reçois (salaire, argent de poche, job d'été, aides…).
- Les **dépenses** : ce que tu paies.

La règle d'or : **dépenser moins que ce qu'on gagne**. La différence, c'est ton **épargne**.

## 2. Dépenses fixes et dépenses variables
- **Dépenses fixes** : les mêmes chaque mois (loyer, abonnement téléphone, assurance). Prévisibles.
- **Dépenses variables** : elles changent (courses, sorties, vêtements, cadeaux). C'est surtout là qu'on peut ajuster.

Repérer ses dépenses variables, c'est repérer où on peut économiser.

## 3. La règle 50/30/20
Une méthode simple pour répartir ses revenus :
- **50 % pour les besoins** : ce qui est indispensable (logement, nourriture, transport).
- **30 % pour les envies** : ce qui fait plaisir (loisirs, restos, jeux).
- **20 % pour l'épargne** : ce que tu mets de côté.

Ces proportions sont un repère, pas une loi : on les adapte à sa situation.

## 4. Se payer soi-même en premier
Le réflexe gagnant : dès que l'argent arrive, **mets ton épargne de côté d'abord**, avant de dépenser le reste. Si tu attends « ce qu'il reste à la fin du mois », il ne reste souvent rien. Un **virement automatique** vers un compte épargne le jour de la paie rend cela indolore.

## 5. Le fonds d'urgence
La première épargne à constituer, c'est un **fonds d'urgence** : de quoi couvrir **3 à 6 mois de dépenses**. Il sert à absorber les coups durs (panne, réparation, perte de revenu) sans avoir à emprunter. On le garde sur un compte **sûr et disponible** (comme un livret), pas investi en Bourse.

## L'essentiel à retenir
- Un budget = revenus – dépenses ; il faut **dépenser moins qu'on gagne**.
- Distinguer **dépenses fixes** et **variables** pour savoir où économiser.
- La règle **50/30/20** : besoins / envies / épargne.
- **Se payer soi-même en premier** (épargne automatique).
- Se constituer un **fonds d'urgence** de **3 à 6 mois** de dépenses.$md$, 1),

  ('Les intérêts composés', $md$# Les intérêts composés

## L'idée de base
Les **intérêts composés**, ce sont « **les intérêts qui rapportent des intérêts** ». Quand ton argent placé produit des intérêts, ces intérêts s'ajoutent au capital… et produisent à leur tour des intérêts. La croissance s'emballe petit à petit.

## 1. Intérêts simples vs intérêts composés
Imagine 1 000 € placés à **10 % par an**.
- En **intérêts simples**, tu gagnes 100 € chaque année, toujours calculés sur les 1 000 € de départ.
- En **intérêts composés**, la 1re année tu gagnes 100 € (tu as 1 100 €). La 2e année, les 10 % se calculent sur **1 100 €**, soit 110 € (tu as 1 210 €). L'écart paraît petit… au début.

## 2. Le vrai moteur : le temps
Plus on laisse l'argent travailler longtemps, plus l'effet devient spectaculaire, car la croissance est **exponentielle**, pas linéaire. Les dernières années rapportent bien plus que les premières.

C'est pour cela qu'on prête à Albert Einstein cette formule : les intérêts composés seraient la **« 8e merveille du monde »**.

## 3. Un exemple chiffré
Tu places **100 € par mois** à **5 % par an** en moyenne.
- Au bout de 30 ans, tu auras versé **36 000 €** de ta poche (100 € × 360 mois).
- Mais grâce aux intérêts composés, ton capital dépasse **80 000 €**.

Plus de la moitié de la somme finale ne vient pas de tes versements, mais des intérêts qui ont fait des petits !

## 4. La leçon : commencer tôt
Le temps compte plus que le montant. Celui qui place un peu **très tôt** finit souvent avec plus que celui qui place beaucoup mais **tard**. Commencer jeune, même avec de petites sommes, est un énorme avantage.

> Attention : l'effet joue aussi **contre toi** sur une dette (une carte de crédit non remboursée gonfle de la même façon).

## L'essentiel à retenir
- Intérêts composés = **des intérêts qui rapportent des intérêts**.
- Le **temps** est le vrai moteur : la croissance est exponentielle.
- Surnommés la **« 8e merveille du monde »**.
- **Commencer tôt** vaut mieux que placer beaucoup plus tard.
- Le même mécanisme fait **gonfler les dettes** : attention.$md$, 2),

  ('Crédit, dettes et arnaques', $md$# Crédit, dettes et arnaques

## Le crédit, ni bon ni mauvais en soi
**Emprunter**, c'est utiliser aujourd'hui de l'argent qu'on remboursera plus tard — avec des **intérêts**, le prix de l'emprunt. Bien utilisé, le crédit est un outil. Mal utilisé, c'est un piège.

## 1. Bon crédit vs mauvais crédit
- **Bon crédit** : emprunter pour quelque chose qui **prend de la valeur** ou t'en fait gagner — des études, un logement, un projet qui rapporte.
- **Mauvais crédit** : emprunter pour **consommer** des choses qui perdent aussitôt de la valeur (dernier téléphone, vacances à crédit). Tu paies plus cher, longtemps, pour un plaisir déjà passé.

## 2. Le coût total d'un crédit
Le chiffre qui compte n'est pas la mensualité, mais le **coût total** : tout ce que tu rembourses **moins** ce que tu as emprunté. Deux repères :
- Plus le **taux d'intérêt** est élevé, plus ça coûte.
- Plus la durée est **longue**, plus tu paies d'intérêts au total (même si la mensualité paraît douce).

## 3. Le crédit renouvelable, à manier avec prudence
Le **crédit renouvelable** (ou « revolving », les réserves d'argent rattachées à certaines cartes) affiche souvent des **taux très élevés**. Facile à obtenir, difficile à rembourser : c'est une cause fréquente de **surendettement**, la situation où l'on ne peut plus faire face à ses dettes.

## 4. Reconnaître les arnaques
Quelques signaux d'alerte qui reviennent toujours :
- Une promesse de **gains rapides et garantis** (« doublez votre argent en un mois »). Le rendement élevé **sans risque** n'existe pas.
- La **pyramide de Ponzi** : on « rémunère » les anciens investisseurs avec l'argent des nouveaux. Tout s'effondre quand les nouveaux manquent.
- L'urgence et la pression (« c'est maintenant ou jamais »), pour t'empêcher de réfléchir.

> La règle qui te protège : **si c'est trop beau pour être vrai, c'est que ça ne l'est pas.**

## L'essentiel à retenir
- Le crédit a un **coût** (les intérêts) : regarder le **coût total**, pas la mensualité.
- **Bon crédit** (investir) vs **mauvais crédit** (consommer).
- Le **crédit renouvelable** est cher → risque de **surendettement**.
- Se méfier des **gains rapides garantis** et des **pyramides de Ponzi**.
- **Trop beau pour être vrai = arnaque.**$md$, 3),

  ('S''initier à l''investissement', $md$# S'initier à l'investissement

> Cette leçon explique des notions générales pour comprendre l'investissement. Ce n'est **pas un conseil financier personnalisé** : chaque situation est différente.

## Épargner puis investir
**Épargner**, c'est mettre de l'argent de côté en sécurité. **Investir**, c'est faire travailler cet argent pour qu'il grossisse sur le long terme — en acceptant une part de risque.

## 1. Risque et rendement
La règle fondamentale : **plus on vise un rendement élevé, plus on prend de risque.** Un placement qui promet beaucoup **sans aucun risque** n'existe pas. On investit donc de l'argent dont on **n'a pas besoin à court terme**.

## 2. Ne pas mettre tous ses œufs dans le même panier
C'est la **diversification** : répartir son argent sur plusieurs placements. Si l'un baisse, les autres amortissent. Tout miser sur une seule entreprise, c'est risquer de tout perdre d'un coup.

## 3. Actions et obligations
- Une **action** est une **part d'entreprise**. Tu deviens copropriétaire ; tu gagnes si l'entreprise prospère, tu perds si elle chute. Potentiel élevé, mais **plus risqué**.
- Une **obligation** est un **prêt** que tu fais (à un État, à une entreprise) contre des intérêts. Généralement **plus sûr**, mais moins rémunérateur.

## 4. Les fonds indiciels (ETF)
Un **fonds indiciel** ou **ETF** achète d'un coup un **panier** de centaines d'entreprises (par exemple les plus grandes d'un pays ou du monde). Avantages : **diversification immédiate** et **frais réduits**. C'est l'outil le plus simple pour un débutant, plutôt que de parier sur une action isolée.

## 5. L'immobilier
Acheter un logement (pour l'habiter ou le louer) est une autre forme d'investissement, souvent financée par un crédit. Cela demande une **grosse mise** et se pense sur de **longues années**.

## 6. Le temps long, pas la spéculation
Investir se joue sur des **années, voire des décennies** : on laisse les intérêts composés agir. **Spéculer** — parier sur les hausses et baisses à court terme — s'apparente au jeu et fait perdre la plupart des gens. Investir régulièrement, calmement, sur le long terme est bien plus solide.

## L'essentiel à retenir
- Plus de **rendement** = plus de **risque** ; le gain garanti sans risque n'existe pas.
- **Diversifier** : ne pas mettre tous ses œufs dans le même panier.
- **Action** (part d'entreprise, risquée) vs **obligation** (prêt, plus sûre).
- Les **ETF / fonds indiciels** offrent diversification et frais bas.
- Penser **long terme**, ne pas **spéculer**.$md$, 4)
) AS v(title, md, pos)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Finances personnelles'
ON CONFLICT (chapter_id, title) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. Un quiz par leçon (rattaché via lesson_id), seulement si la leçon n'en a
--    pas déjà un. Quiz gratuits (culture générale accessible à tous).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Culture générale', 'tous', 'Finances personnelles', true, l.id
FROM (VALUES
  ('15219999-0000-4000-8000-000000000001'::uuid, 'Budget et épargne', 'Faire un budget et épargner'),
  ('15219999-0000-4000-8000-000000000002'::uuid, 'Intérêts composés', 'Les intérêts composés'),
  ('15219999-0000-4000-8000-000000000003'::uuid, 'Crédit et arnaques', 'Crédit, dettes et arnaques'),
  ('15219999-0000-4000-8000-000000000004'::uuid, 'Investissement', 'S''initier à l''investissement')
) AS v(quiz_id, title, lesson)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Finances personnelles'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = v.lesson
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. Questions (10 par quiz), attachées au quiz de la leçon via la jointure.
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Faire un budget et épargner
  ('15210000-0000-4000-8000-000000000101'::uuid, 'Faire un budget et épargner',
   'Qu''est-ce qu''un budget ?', 'mcq',
   '["Un plan de ce qui entre et sort comme argent", "Un compte en banque bloqué", "Un impôt sur le revenu", "Un crédit à la consommation"]', 0,
   'Un budget compare les revenus et les dépenses pour décider où va l''argent.', 1),
  ('15210000-0000-4000-8000-000000000102'::uuid, 'Faire un budget et épargner',
   'Comment se répartit la règle 50/30/20 ?', 'mcq',
   '["50 % besoins, 30 % envies, 20 % épargne", "50 % épargne, 30 % besoins, 20 % envies", "50 % envies, 30 % épargne, 20 % besoins", "50 % impôts, 30 % besoins, 20 % loisirs"]', 0,
   '50 % pour les besoins, 30 % pour les envies, 20 % pour l''épargne.', 2),
  ('15210000-0000-4000-8000-000000000103'::uuid, 'Faire un budget et épargner',
   'Dans la règle 50/30/20, quelle part est consacrée à l''épargne ?', 'mcq',
   '["20 %", "50 %", "30 %", "10 %"]', 0,
   'La part « épargne » représente 20 % des revenus.', 3),
  ('15210000-0000-4000-8000-000000000104'::uuid, 'Faire un budget et épargner',
   'Lequel est une dépense fixe ?', 'mcq',
   '["Le loyer", "Les sorties", "Les vêtements", "Les cadeaux"]', 0,
   'Le loyer revient identique chaque mois : c''est une dépense fixe.', 4),
  ('15210000-0000-4000-8000-000000000105'::uuid, 'Faire un budget et épargner',
   'Que veut dire « se payer soi-même en premier » ?', 'mcq',
   '["Mettre son épargne de côté dès que l''argent arrive", "Se faire un cadeau chaque mois", "Rembourser ses dettes en dernier", "Dépenser avant d''épargner"]', 0,
   'On épargne d''abord, puis on dépense le reste — idéalement par virement automatique.', 5),
  ('15210000-0000-4000-8000-000000000106'::uuid, 'Faire un budget et épargner',
   'À quoi sert un fonds d''urgence ?', 'mcq',
   '["Couvrir les coups durs sans emprunter", "Spéculer en Bourse", "Payer ses impôts en avance", "Acheter des actions risquées"]', 0,
   'C''est un matelas de sécurité pour les imprévus, gardé sur un compte sûr.', 6),
  ('15210000-0000-4000-8000-000000000107'::uuid, 'Faire un budget et épargner',
   'Combien de mois de dépenses conseille-t-on pour un fonds d''urgence ?', 'mcq',
   '["3 à 6 mois", "1 semaine", "10 ans", "20 mois"]', 0,
   'On vise en général de quoi tenir 3 à 6 mois de dépenses.', 7),
  ('15210000-0000-4000-8000-000000000108'::uuid, 'Faire un budget et épargner',
   'Pour épargner, il vaut mieux dépenser moins que ce que l''on gagne.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''épargne, c''est précisément la différence entre ce qu''on gagne et ce qu''on dépense.', 8),
  ('15210000-0000-4000-8000-000000000109'::uuid, 'Faire un budget et épargner',
   'Où vaut-il mieux garder son fonds d''urgence ?', 'mcq',
   '["Sur un compte sûr et disponible (livret)", "Investi entièrement en actions", "En cryptomonnaies", "Dans un crédit renouvelable"]', 0,
   'Il doit rester disponible et sans risque : un livret convient.', 9),
  ('15210000-0000-4000-8000-000000000110'::uuid, 'Faire un budget et épargner',
   'Sur quelles dépenses peut-on le plus facilement économiser ?', 'mcq',
   '["Les dépenses variables", "Les dépenses fixes", "Le loyer", "Les assurances obligatoires"]', 0,
   'Les dépenses variables (sorties, courses, achats) sont les plus ajustables.', 10),

  -- Les intérêts composés
  ('15210000-0000-4000-8000-000000000201'::uuid, 'Les intérêts composés',
   'Que sont les intérêts composés ?', 'mcq',
   '["Des intérêts qui rapportent eux-mêmes des intérêts", "Un impôt sur l''épargne", "Des intérêts payés une seule fois", "Une remise sur un crédit"]', 0,
   'Les intérêts s''ajoutent au capital et produisent à leur tour des intérêts.', 1),
  ('15210000-0000-4000-8000-000000000202'::uuid, 'Les intérêts composés',
   'Quel est le vrai moteur des intérêts composés ?', 'mcq',
   '["Le temps", "La chance", "L''inflation", "Les impôts"]', 0,
   'Plus l''argent reste placé longtemps, plus l''effet devient spectaculaire.', 2),
  ('15210000-0000-4000-8000-000000000203'::uuid, 'Les intérêts composés',
   '1 000 € placés à 10 % par an en intérêts composés valent, après 2 ans…', 'mcq',
   '["1 210 €", "1 200 €", "1 100 €", "2 000 €"]', 0,
   'Année 1 : 1 100 € ; année 2 : +10 % de 1 100 € = 1 210 €.', 3),
  ('15210000-0000-4000-8000-000000000204'::uuid, 'Les intérêts composés',
   'Comment surnomme-t-on souvent les intérêts composés ?', 'mcq',
   '["La 8e merveille du monde", "Le trou noir de l''épargne", "La règle d''or", "Le repas gratuit"]', 0,
   'Une formule célèbre, souvent attribuée à Einstein.', 4),
  ('15210000-0000-4000-8000-000000000205'::uuid, 'Les intérêts composés',
   'En plaçant 100 € par mois à 5 % pendant 30 ans, combien as-tu versé de ta poche ?', 'mcq',
   '["36 000 €", "80 000 €", "100 000 €", "12 000 €"]', 0,
   '100 € × 12 mois × 30 ans = 36 000 € versés.', 5),
  ('15210000-0000-4000-8000-000000000206'::uuid, 'Les intérêts composés',
   'Avec ces mêmes 100 €/mois à 5 % sur 30 ans, le capital final dépasse…', 'mcq',
   '["80 000 €", "40 000 €", "36 000 €", "50 000 €"]', 0,
   'Grâce aux intérêts composés, le capital dépasse 80 000 € pour 36 000 € versés.', 6),
  ('15210000-0000-4000-8000-000000000207'::uuid, 'Les intérêts composés',
   'La croissance produite par les intérêts composés est…', 'mcq',
   '["exponentielle", "linéaire", "décroissante", "toujours nulle"]', 0,
   'Elle s''accélère avec le temps : les dernières années rapportent le plus.', 7),
  ('15210000-0000-4000-8000-000000000208'::uuid, 'Les intérêts composés',
   'Pour profiter des intérêts composés, il vaut mieux…', 'mcq',
   '["commencer tôt, même avec peu", "attendre d''être riche", "placer une seule fois puis tout retirer", "changer de placement chaque mois"]', 0,
   'Le temps compte plus que le montant : commencer jeune est un atout énorme.', 8),
  ('15210000-0000-4000-8000-000000000209'::uuid, 'Les intérêts composés',
   'Le mécanisme des intérêts composés peut aussi faire gonfler une dette.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : une carte de crédit non remboursée grossit de la même façon.', 9),
  ('15210000-0000-4000-8000-000000000210'::uuid, 'Les intérêts composés',
   'En intérêts simples, 1 000 € à 10 % rapportent chaque année…', 'mcq',
   '["100 € (toujours sur les 1 000 € de départ)", "un montant qui augmente chaque année", "1 210 € dès la 2e année", "rien du tout"]', 0,
   'En intérêts simples, le calcul reste sur le capital de départ : 100 €/an.', 10),

  -- Crédit, dettes et arnaques
  ('15210000-0000-4000-8000-000000000301'::uuid, 'Crédit, dettes et arnaques',
   'Qu''est-ce qu''emprunter (un crédit) ?', 'mcq',
   '["Utiliser aujourd''hui de l''argent qu''on remboursera plus tard, avec intérêts", "Recevoir de l''argent gratuit", "Un cadeau de la banque", "Un placement en Bourse"]', 0,
   'Le crédit se rembourse avec des intérêts, qui sont le prix de l''emprunt.', 1),
  ('15210000-0000-4000-8000-000000000302'::uuid, 'Crédit, dettes et arnaques',
   'Lequel ressemble le plus à un « bon crédit » ?', 'mcq',
   '["Emprunter pour ses études ou un logement", "Emprunter pour le dernier téléphone", "Emprunter pour des vacances", "Emprunter pour jouer au casino"]', 0,
   'Un bon crédit finance ce qui prend de la valeur ou rapporte (études, immobilier).', 2),
  ('15210000-0000-4000-8000-000000000303'::uuid, 'Crédit, dettes et arnaques',
   'Pour juger le poids réel d''un crédit, on regarde surtout…', 'mcq',
   '["le coût total (tout ce qu''on rembourse en plus)", "seulement la mensualité", "la couleur de la carte", "le nom de la banque"]', 0,
   'Le coût total = tout ce qu''on rembourse moins ce qu''on a emprunté.', 3),
  ('15210000-0000-4000-8000-000000000304'::uuid, 'Crédit, dettes et arnaques',
   'À taux égal, un crédit plus long coûte…', 'mcq',
   '["plus cher au total (plus d''intérêts)", "toujours moins cher", "exactement le même prix", "rien de plus"]', 0,
   'Plus la durée est longue, plus on paie d''intérêts au total.', 4),
  ('15210000-0000-4000-8000-000000000305'::uuid, 'Crédit, dettes et arnaques',
   'Le crédit renouvelable (revolving) est réputé pour…', 'mcq',
   '["ses taux d''intérêt très élevés", "être totalement gratuit", "rapporter de l''argent", "être réservé aux riches"]', 0,
   'Facile à obtenir mais cher, il est une cause fréquente de surendettement.', 5),
  ('15210000-0000-4000-8000-000000000306'::uuid, 'Crédit, dettes et arnaques',
   'Qu''est-ce que le surendettement ?', 'mcq',
   '["Ne plus pouvoir faire face à ses dettes", "Avoir beaucoup d''épargne", "Payer ses dettes en avance", "Un type de placement"]', 0,
   'C''est la situation où l''on n''arrive plus à rembourser ce que l''on doit.', 6),
  ('15210000-0000-4000-8000-000000000307'::uuid, 'Crédit, dettes et arnaques',
   'Quel est un signal d''alerte typique d''une arnaque ?', 'mcq',
   '["Une promesse de gains rapides et garantis", "Un rendement modeste et incertain", "Des frais clairement expliqués", "Le temps de réfléchir"]', 0,
   'Le gain élevé « sans aucun risque » n''existe pas : c''est un piège.', 7),
  ('15210000-0000-4000-8000-000000000308'::uuid, 'Crédit, dettes et arnaques',
   'Comment fonctionne une pyramide de Ponzi ?', 'mcq',
   '["On paie les anciens avec l''argent des nouveaux", "On investit dans de vraies entreprises", "On rembourse grâce aux bénéfices réels", "On place l''argent sur un livret"]', 0,
   'Sans nouveaux entrants, le système s''effondre : il ne crée aucune richesse.', 8),
  ('15210000-0000-4000-8000-000000000309'::uuid, 'Crédit, dettes et arnaques',
   'Un placement peut offrir un rendement très élevé sans aucun risque.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : rendement élevé rime toujours avec risque. La promesse inverse est une arnaque.', 9),
  ('15210000-0000-4000-8000-000000000310'::uuid, 'Crédit, dettes et arnaques',
   'Quelle règle simple aide à repérer une arnaque ?', 'mcq',
   '["Si c''est trop beau pour être vrai, ça ne l''est pas", "Il faut toujours agir dans l''urgence", "Les inconnus sur Internet sont fiables", "Un gros gain garantit un placement sérieux"]', 0,
   'Méfiance devant les offres « trop belles » et la pression à décider vite.', 10),

  -- S'initier à l'investissement
  ('15210000-0000-4000-8000-000000000401'::uuid, 'S''initier à l''investissement',
   'Quelle est la règle fondamentale de l''investissement ?', 'mcq',
   '["Plus de rendement = plus de risque", "Plus de rendement = moins de risque", "Le rendement élevé est toujours sans risque", "Le risque n''existe pas en Bourse"]', 0,
   'Un rendement élevé garanti sans risque n''existe pas.', 1),
  ('15210000-0000-4000-8000-000000000402'::uuid, 'S''initier à l''investissement',
   'Que signifie « diversifier » ?', 'mcq',
   '["Répartir son argent sur plusieurs placements", "Tout miser sur une seule action", "Ne jamais investir", "Emprunter pour investir"]', 0,
   'Si un placement baisse, les autres amortissent la perte.', 2),
  ('15210000-0000-4000-8000-000000000403'::uuid, 'S''initier à l''investissement',
   'Quel proverbe illustre la diversification ?', 'mcq',
   '["Ne pas mettre tous ses œufs dans le même panier", "L''argent ne fait pas le bonheur", "Un tiens vaut mieux que deux tu l''auras", "Qui ne risque rien n''a rien"]', 0,
   'Répartir ses placements évite de tout perdre d''un coup.', 3),
  ('15210000-0000-4000-8000-000000000404'::uuid, 'S''initier à l''investissement',
   'Qu''est-ce qu''une action ?', 'mcq',
   '["Une part d''entreprise", "Un prêt à un État", "Un compte épargne garanti", "Une assurance"]', 0,
   'Détenir une action, c''est être copropriétaire d''une entreprise.', 4),
  ('15210000-0000-4000-8000-000000000405'::uuid, 'S''initier à l''investissement',
   'Qu''est-ce qu''une obligation ?', 'mcq',
   '["Un prêt (à un État ou une entreprise) contre des intérêts", "Une part d''entreprise", "Un bien immobilier", "Une cryptomonnaie"]', 0,
   'L''obligation est généralement plus sûre, mais moins rémunératrice que l''action.', 5),
  ('15210000-0000-4000-8000-000000000406'::uuid, 'S''initier à l''investissement',
   'Entre action et obligation, laquelle est en général la plus risquée ?', 'mcq',
   '["L''action", "L''obligation", "Les deux sont sans risque", "Aucune ne comporte de risque"]', 0,
   'L''action suit le sort de l''entreprise : potentiel plus élevé, mais plus risqué.', 6),
  ('15210000-0000-4000-8000-000000000407'::uuid, 'S''initier à l''investissement',
   'Quel est l''intérêt d''un fonds indiciel (ETF) ?', 'mcq',
   '["Diversification immédiate et frais réduits", "Un gain garanti sans risque", "Parier sur une seule entreprise", "Éviter toute fluctuation"]', 0,
   'Un ETF achète d''un coup un panier de nombreuses entreprises, à faibles frais.', 7),
  ('15210000-0000-4000-8000-000000000408'::uuid, 'S''initier à l''investissement',
   'Sur quel horizon investit-on raisonnablement ?', 'mcq',
   '["Le long terme (années, décennies)", "Quelques jours", "Une seule journée", "Jamais plus d''un mois"]', 0,
   'Investir sur le long terme laisse agir les intérêts composés.', 8),
  ('15210000-0000-4000-8000-000000000409'::uuid, 'S''initier à l''investissement',
   'Parier sur les hausses et baisses à court terme s''appelle…', 'mcq',
   '["spéculer", "diversifier", "épargner", "budgétiser"]', 0,
   'La spéculation à court terme s''apparente au jeu et fait perdre la plupart des gens.', 9),
  ('15210000-0000-4000-8000-000000000410'::uuid, 'S''initier à l''investissement',
   'On devrait investir de l''argent dont on a besoin le mois prochain.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : on investit de l''argent dont on n''a pas besoin à court terme.', 10)
) AS d(id, lesson, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Finances personnelles'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = d.lesson
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
