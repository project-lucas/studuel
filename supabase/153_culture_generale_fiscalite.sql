-- =============================================================================
-- Studuel — Migration 153 : Culture générale — Fiscalité
--
-- Nouveau THÈME « Fiscalité » dans le dossier hors-programme « Culture générale »
-- (subject slug 'culture-generale', déjà créé en 150). On NE recrée PAS le
-- subject ni la contrainte de catégorie : on ajoute seulement un chapitre-thème
-- au niveau fixe « tous » et ses leçons (cours + quiz).
--   - Thème « Fiscalité » = comprendre à quoi servent les impôts, les grands
--     impôts français et la lecture d'une fiche de paie (niveau lycéen).
--
-- PRÉREQUIS : 150 (subject « Culture générale », colonne fixed_level, catégorie
-- « culture »). Idempotent (ON CONFLICT / gardes NOT EXISTS).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Thème « Fiscalité » (chapitre au niveau fixe « tous », position 3).
-- -----------------------------------------------------------------------------
INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, 'tous', 'Fiscalité', 3
FROM public.subjects s WHERE s.slug = 'culture-generale'
ON CONFLICT (subject_id, level, title) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. Leçons du thème (cours dans lessons.content).
-- -----------------------------------------------------------------------------
INSERT INTO public.lessons (chapter_id, title, content, position)
SELECT c.id, v.title, v.md, v.pos
FROM (VALUES
  ('À quoi servent les impôts', $md$# À quoi servent les impôts

## Une contribution pour vivre ensemble
Un **impôt** est une somme que l'État et les collectivités (région, département, commune) prélèvent sur les citoyens et les entreprises, **sans contrepartie directe** et individualisée. Personne ne « paie » sa propre route ou son propre hôpital : on met en commun pour financer ce qui profite à tous.

## 1. Financer les biens et services publics
La première mission de l'impôt est de payer ce que le marché ne fournit pas spontanément à tous :
- **Éducation** : écoles, collèges, lycées, universités, salaires des enseignants.
- **Santé** : hôpitaux publics, une partie du système de soins.
- **Sécurité et justice** : police, gendarmerie, pompiers, tribunaux.
- **Défense** : l'armée.
- **Infrastructures** : routes, ponts, éclairage, transports, réseaux.

Ces services sont dits **non-rivaux** ou **collectifs** : l'éclairage d'une rue profite à tous ceux qui passent, on ne peut pas facilement le vendre à l'unité.

## 2. La redistribution (la solidarité)
L'impôt sert aussi à **réduire les inégalités**. L'État prélève davantage sur les hauts revenus et verse des **prestations** (allocations, bourses, minima sociaux) à ceux qui en ont besoin. On parle de **redistribution** : c'est le cœur de la **solidarité** nationale.

## 3. Le consentement à l'impôt
Payer l'impôt n'est pas qu'une contrainte : c'est un **principe démocratique**. La **Déclaration des droits de l'homme et du citoyen de 1789** l'inscrit noir sur blanc :
- **Article 13** : une contribution commune est indispensable ; elle doit être **répartie entre les citoyens en raison de leurs facultés** (selon les moyens de chacun).
- **Article 14** : les citoyens ont le droit de **constater la nécessité** de l'impôt, d'y **consentir librement** et d'en suivre l'emploi.

C'est pour cela que ce sont les **représentants élus** (le Parlement) qui votent chaque année l'impôt, dans la **loi de finances**.

## 4. Impôts ≠ cotisations sociales
Attention à ne pas confondre :
- Les **impôts** (impôt sur le revenu, TVA…) financent le **budget de l'État** et des collectivités.
- Les **cotisations sociales** (prélevées sur les salaires) financent la **Sécurité sociale** : maladie, retraite, chômage, famille. Elles ouvrent des **droits** (une pension, un remboursement de soins), ce qui les distingue de l'impôt « sans contrepartie ».

## L'essentiel à retenir
- L'impôt est un prélèvement **sans contrepartie directe**, voté par le Parlement.
- Il finance les **services publics** (école, santé, sécurité, routes, armée).
- Il permet la **redistribution** et donc la **solidarité**.
- Le **consentement à l'impôt** est un principe de 1789 (**articles 13 et 14**).
- Les **cotisations sociales** ne sont pas des impôts : elles ouvrent des droits (Sécu).$md$, 1),

  ('Les grands impôts en France', $md$# Les grands impôts en France

## Deux grandes familles d'impôts
On classe les impôts selon deux distinctions utiles :
- **Direct / indirect** : un impôt **direct** est payé directement par la personne concernée (l'impôt sur le revenu). Un impôt **indirect** est inclus dans un prix et payé « sans y penser » lors d'un achat (la TVA).
- **Progressif / proportionnel** : un impôt **progressif** applique un **taux qui augmente** avec le revenu ; un impôt **proportionnel** applique le **même taux** pour tous.

## 1. L'impôt sur le revenu (IR)
C'est un impôt **direct** et **progressif**, calculé **par tranches**. Le revenu est découpé en tranches, et chaque tranche est taxée à un taux croissant (0 %, 11 %, 30 %, 41 %, 45 %).

> Exemple simplifié : la première tranche n'est pas imposée, la part de revenu suivante est taxée à 11 %, etc. **Seule la part qui dépasse** un seuil est taxée au taux supérieur — gagner plus ne fait donc jamais baisser son revenu net.

Depuis 2019, l'IR est collecté par **prélèvement à la source** : il est retenu chaque mois sur le salaire, au lieu d'être payé un an plus tard.

## 2. La TVA (taxe sur la valeur ajoutée)
C'est l'impôt qui **rapporte le plus** à l'État. C'est un impôt **indirect** sur la **consommation** : il est ajouté au prix des produits et services.
- Taux **normal : 20 %** (la plupart des biens).
- Taux **intermédiaire : 10 %** (restauration, transports…).
- Taux **réduit : 5,5 %** (produits alimentaires de base, livres…).

La TVA est **indolore** (on ne la remarque pas, elle est dans le prix affiché) mais **proportionnelle** : riche ou pauvre, on paie le même taux sur un même produit. Comme les plus modestes consomment une plus grande part de leurs revenus, la TVA pèse relativement plus sur eux.

## 3. Les impôts locaux
Ils financent les **collectivités** (communes, départements). Le principal aujourd'hui est la **taxe foncière**, payée par les **propriétaires** d'un logement ou d'un terrain. (La taxe d'habitation sur les résidences principales a été supprimée pour les ménages.)

## 4. L'impôt sur les sociétés (IS)
Les **entreprises** paient un impôt sur leurs **bénéfices** : l'impôt sur les sociétés, dont le taux normal est d'environ **25 %**.

## Récapitulatif
| Impôt | Direct/indirect | Sur quoi ? |
|-------|-----------------|-----------|
| Impôt sur le revenu | direct, progressif | revenus des ménages |
| TVA | indirect, proportionnel | la consommation |
| Taxe foncière | direct (local) | la propriété immobilière |
| Impôt sur les sociétés | direct | les bénéfices des entreprises |

## L'essentiel à retenir
- **IR** : direct, **progressif par tranches**, **prélèvement à la source**.
- **TVA** : indirect, sur la **consommation**, taux **20 % / 10 % / 5,5 %**, indolore et **proportionnel** ; c'est l'impôt qui rapporte le plus.
- **Impôts locaux** : surtout la **taxe foncière** (propriétaires).
- **Impôt sur les sociétés** : sur les **bénéfices** des entreprises (~25 %).$md$, 2),

  ('Lire sa fiche de paie', $md$# Lire sa fiche de paie

## Un document qui raconte un salaire
La **fiche de paie** (ou bulletin de salaire) est le document que l'employeur remet chaque mois. Elle explique comment on passe du salaire annoncé à l'embauche à la somme réellement versée sur le compte. Le secret : entre les deux, il y a les **cotisations sociales** et l'**impôt**.

## 1. Salaire brut vs salaire net
- Le **salaire brut** est le salaire **avant** toute déduction : c'est le montant inscrit dans le contrat de travail.
- Le **salaire net** est ce qui reste **après** avoir retiré les cotisations sociales.

> Ordre de grandeur : pour un salarié, le **net est environ 22 à 25 % plus bas que le brut**. Un brut de 2 000 € donne à peu près 1 550 € de net (avant impôt).

## 2. Les cotisations sociales : un salaire différé
La différence entre brut et net, ce sont les **cotisations sociales**. Elles ne « disparaissent » pas : elles financent la **protection sociale** et ouvrent des **droits**.
- **Santé** (assurance maladie) : remboursement des soins.
- **Retraite** : la pension future.
- **Chômage** : l'allocation en cas de perte d'emploi.
- **Famille**, accidents du travail…

C'est pourquoi on parle de **salaire différé** ou **socialisé** : une part de la rémunération est mise de côté collectivement pour être reversée plus tard (maladie, retraite, chômage).

## 3. Les différents « nets » de la fiche
Depuis la retenue de l'impôt à la source, la fiche affiche plusieurs lignes :
- **Net à payer avant impôt** : le salaire après cotisations, mais avant impôt.
- **Prélèvement à la source** : l'impôt sur le revenu retenu directement.
- **Net à payer** (ou net versé) : ce qui arrive réellement sur le compte.
- **Net imposable** : la base utilisée pour calculer l'impôt (légèrement différente du net versé).

## 4. Ce que coûte vraiment un salarié : le super-brut
L'employeur, en plus du brut, paie aussi des **cotisations patronales**. Le total (brut + cotisations patronales) s'appelle le **coût total employeur** ou **super-brut**.

> Exemple d'ordre de grandeur : pour un net d'environ **1 550 €**, le brut est d'environ **2 000 €**, et le **coût total pour l'employeur** est d'environ **2 800 €**. La différence entre ce que verse l'employeur et ce que touche le salarié finance toute la protection sociale.

## L'essentiel à retenir
- **Brut** = avant déductions ; **net** = après cotisations (net ≈ brut − ~23 %).
- Les **cotisations sociales** financent santé, retraite, chômage : c'est un **salaire différé**, pas de l'argent perdu.
- La fiche distingue **net avant impôt**, **prélèvement à la source**, **net à payer** et **net imposable**.
- Le **super-brut** (coût total employeur) est supérieur au brut : le salarié « coûte » plus que ce qu'il touche.$md$, 3)
) AS v(title, md, pos)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Fiscalité'
ON CONFLICT (chapter_id, title) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. Un quiz par leçon (rattaché via lesson_id), seulement si la leçon n'en a
--    pas déjà un. Quiz gratuits (culture générale accessible à tous).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Culture générale', 'tous', 'Fiscalité', true, l.id
FROM (VALUES
  ('15319999-0000-4000-8000-000000000001'::uuid, 'À quoi servent les impôts', 'À quoi servent les impôts'),
  ('15319999-0000-4000-8000-000000000002'::uuid, 'Les grands impôts en France', 'Les grands impôts en France'),
  ('15319999-0000-4000-8000-000000000003'::uuid, 'Lire sa fiche de paie', 'Lire sa fiche de paie')
) AS v(quiz_id, title, lesson)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Fiscalité'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = v.lesson
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. Questions (10 par quiz), attachées au quiz de la leçon via la jointure.
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- À quoi servent les impôts
  ('15310000-0000-4000-8000-000000000101'::uuid, 'À quoi servent les impôts',
   'Qu''est-ce qu''un impôt ?', 'mcq',
   '["Un prélèvement sans contrepartie directe", "Le prix d''un service qu''on achète", "Un don volontaire", "Une amende"]', 0,
   'L''impôt est prélevé sans contrepartie individualisée : on ne paie pas sa propre route.', 1),
  ('15310000-0000-4000-8000-000000000102'::uuid, 'À quoi servent les impôts',
   'Lequel de ces éléments est financé par l''impôt ?', 'mcq',
   '["Les écoles publiques", "Un abonnement de streaming privé", "Un loyer privé", "Un achat au supermarché"]', 0,
   'Écoles, hôpitaux, police, routes, armée : des services publics financés par l''impôt.', 2),
  ('15310000-0000-4000-8000-000000000103'::uuid, 'À quoi servent les impôts',
   'Comment appelle-t-on le fait de prélever davantage sur les plus aisés pour aider les plus modestes ?', 'mcq',
   '["la redistribution", "l''inflation", "la spéculation", "l''autarcie"]', 0,
   'La redistribution est au cœur de la solidarité nationale.', 3),
  ('15310000-0000-4000-8000-000000000104'::uuid, 'À quoi servent les impôts',
   'Quel texte de 1789 fonde le consentement à l''impôt ?', 'mcq',
   '["La Déclaration des droits de l''homme et du citoyen", "Le Code civil", "La Constitution de 1958", "Le traité de Rome"]', 0,
   'Ses articles 13 et 14 posent la contribution commune et le consentement à l''impôt.', 4),
  ('15310000-0000-4000-8000-000000000105'::uuid, 'À quoi servent les impôts',
   'Selon l''article 13 de 1789, la contribution commune doit être répartie…', 'mcq',
   '["en raison des facultés (moyens) de chacun", "également, même somme pour tous", "au hasard", "uniquement sur les entreprises"]', 0,
   'Chacun contribue selon ses moyens : c''est l''idée de justice fiscale.', 5),
  ('15310000-0000-4000-8000-000000000106'::uuid, 'À quoi servent les impôts',
   'Qui vote l''impôt chaque année en France ?', 'mcq',
   '["le Parlement (les représentants élus)", "les banques", "les entreprises", "le président seul"]', 0,
   'Le Parlement vote l''impôt dans la loi de finances : c''est le consentement à l''impôt.', 6),
  ('15310000-0000-4000-8000-000000000107'::uuid, 'À quoi servent les impôts',
   'Quelle différence entre impôts et cotisations sociales ?', 'mcq',
   '["Les cotisations ouvrent des droits (retraite, soins), pas l''impôt", "Il n''y a aucune différence", "Les impôts financent la Sécu, pas les cotisations", "Les cotisations sont volontaires"]', 0,
   'Les cotisations financent la Sécurité sociale et ouvrent des droits ; l''impôt n''a pas de contrepartie directe.', 7),
  ('15310000-0000-4000-8000-000000000108'::uuid, 'À quoi servent les impôts',
   'Les cotisations sociales financent la Sécurité sociale (maladie, retraite, chômage).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : elles alimentent la protection sociale, contrairement aux impôts du budget de l''État.', 8),
  ('15310000-0000-4000-8000-000000000109'::uuid, 'À quoi servent les impôts',
   'Un service « collectif » comme l''éclairage public…', 'mcq',
   '["profite à tous et se vend mal à l''unité", "ne profite qu''à celui qui paie", "est toujours privé", "est interdit par la loi"]', 0,
   'Ces biens collectifs profitent à tous : c''est pourquoi l''impôt les finance.', 9),
  ('15310000-0000-4000-8000-000000000110'::uuid, 'À quoi servent les impôts',
   'Payer l''impôt relève seulement de la contrainte, jamais d''un principe démocratique.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le consentement à l''impôt, voté par les élus, est un principe démocratique (1789).', 10),

  -- Les grands impôts en France
  ('15310000-0000-4000-8000-000000000201'::uuid, 'Les grands impôts en France',
   'L''impôt sur le revenu (IR) est…', 'mcq',
   '["direct et progressif par tranches", "indirect et proportionnel", "payé par les entreprises", "inclus dans le prix des produits"]', 0,
   'L''IR est direct et progressif : le taux augmente par tranches de revenu.', 1),
  ('15310000-0000-4000-8000-000000000202'::uuid, 'Les grands impôts en France',
   'Dans un impôt progressif par tranches, gagner un peu plus…', 'mcq',
   '["ne fait jamais baisser le revenu net", "fait toujours baisser le net", "supprime l''impôt", "double l''impôt"]', 0,
   'Seule la part au-dessus du seuil est taxée au taux supérieur : le net augmente toujours.', 2),
  ('15310000-0000-4000-8000-000000000203'::uuid, 'Les grands impôts en France',
   'Comment l''impôt sur le revenu est-il collecté depuis 2019 ?', 'mcq',
   '["par prélèvement à la source", "en une seule fois en décembre", "par les communes", "en espèces uniquement"]', 0,
   'Le prélèvement à la source retient l''IR chaque mois sur le salaire.', 3),
  ('15310000-0000-4000-8000-000000000204'::uuid, 'Les grands impôts en France',
   'Que taxe la TVA ?', 'mcq',
   '["la consommation (les achats)", "les salaires", "la propriété", "les bénéfices des entreprises"]', 0,
   'La TVA est un impôt indirect sur la consommation, inclus dans les prix.', 4),
  ('15310000-0000-4000-8000-000000000205'::uuid, 'Les grands impôts en France',
   'Quel est le taux normal de la TVA en France ?', 'mcq',
   '["20 %", "5,5 %", "10 %", "33 %"]', 0,
   'Taux normal 20 %, intermédiaire 10 %, réduit 5,5 %.', 5),
  ('15310000-0000-4000-8000-000000000206'::uuid, 'Les grands impôts en France',
   'La TVA est souvent qualifiée de…', 'mcq',
   '["indolore et proportionnelle", "progressive", "directe", "payée seulement par les riches"]', 0,
   'Indolore car incluse dans le prix ; proportionnelle car même taux pour tous.', 6),
  ('15310000-0000-4000-8000-000000000207'::uuid, 'Les grands impôts en France',
   'Qui paie la taxe foncière ?', 'mcq',
   '["les propriétaires d''un bien immobilier", "les locataires seulement", "les entreprises seulement", "tout le monde de façon égale"]', 0,
   'La taxe foncière, impôt local, est due par les propriétaires.', 7),
  ('15310000-0000-4000-8000-000000000208'::uuid, 'Les grands impôts en France',
   'Sur quoi porte l''impôt sur les sociétés (IS) ?', 'mcq',
   '["les bénéfices des entreprises", "le chiffre d''affaires", "les salaires versés", "la consommation"]', 0,
   'L''IS taxe les bénéfices des entreprises (taux normal ~25 %).', 8),
  ('15310000-0000-4000-8000-000000000209'::uuid, 'Les grands impôts en France',
   'La TVA est l''impôt qui rapporte le plus à l''État français.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la TVA est la première recette fiscale de l''État.', 9),
  ('15310000-0000-4000-8000-000000000210'::uuid, 'Les grands impôts en France',
   'Quelle est la différence entre un impôt direct et un impôt indirect ?', 'mcq',
   '["Le direct est payé par la personne concernée, l''indirect est inclus dans un prix", "Aucune différence", "Le direct est toujours plus élevé", "L''indirect est payé par l''État"]', 0,
   'Impôt direct : l''IR. Impôt indirect : la TVA, incluse dans les prix.', 10),

  -- Lire sa fiche de paie
  ('15310000-0000-4000-8000-000000000301'::uuid, 'Lire sa fiche de paie',
   'Que représente le salaire brut ?', 'mcq',
   '["le salaire avant toute déduction", "ce qui est versé sur le compte", "le salaire après impôt", "les cotisations patronales"]', 0,
   'Le brut est le montant du contrat, avant cotisations et impôt.', 1),
  ('15310000-0000-4000-8000-000000000302'::uuid, 'Lire sa fiche de paie',
   'Le salaire net, c''est…', 'mcq',
   '["le brut après retrait des cotisations sociales", "le brut avant cotisations", "le coût total pour l''employeur", "le montant de la TVA"]', 0,
   'Le net est ce qui reste une fois les cotisations salariales retirées.', 2),
  ('15310000-0000-4000-8000-000000000303'::uuid, 'Lire sa fiche de paie',
   'À quoi correspond la différence entre brut et net ?', 'mcq',
   '["aux cotisations sociales", "à la TVA", "à la taxe foncière", "à un bonus"]', 0,
   'La différence brut/net, ce sont les cotisations sociales salariales.', 3),
  ('15310000-0000-4000-8000-000000000304'::uuid, 'Lire sa fiche de paie',
   'Pourquoi parle-t-on de « salaire différé » pour les cotisations ?', 'mcq',
   '["Elles ouvrent des droits reversés plus tard (retraite, maladie, chômage)", "Elles sont perdues", "Elles reviennent en cadeau", "Elles paient la TVA"]', 0,
   'Une part du salaire est mise de côté collectivement pour être reversée en cas de besoin.', 4),
  ('15310000-0000-4000-8000-000000000305'::uuid, 'Lire sa fiche de paie',
   'Lequel de ces risques n''est PAS couvert par les cotisations sociales ?', 'mcq',
   '["l''achat d''une voiture neuve", "la maladie", "la retraite", "le chômage"]', 0,
   'Les cotisations couvrent santé, retraite, chômage, famille — pas un achat personnel.', 5),
  ('15310000-0000-4000-8000-000000000306'::uuid, 'Lire sa fiche de paie',
   'Que signifie « net à payer avant impôt » sur la fiche ?', 'mcq',
   '["le salaire après cotisations mais avant l''impôt sur le revenu", "le salaire brut", "le coût employeur", "le montant de l''impôt"]', 0,
   'C''est le net une fois les cotisations retirées, avant le prélèvement à la source.', 6),
  ('15310000-0000-4000-8000-000000000307'::uuid, 'Lire sa fiche de paie',
   'Comment l''impôt sur le revenu apparaît-il aujourd''hui sur la fiche de paie ?', 'mcq',
   '["comme un prélèvement à la source", "il n''apparaît jamais", "comme une TVA", "comme une cotisation patronale"]', 0,
   'Depuis 2019, l''impôt est retenu chaque mois : c''est le prélèvement à la source.', 7),
  ('15310000-0000-4000-8000-000000000308'::uuid, 'Lire sa fiche de paie',
   'Qu''appelle-t-on le « super-brut » (coût total employeur) ?', 'mcq',
   '["le brut plus les cotisations patronales", "le net à payer", "le brut moins l''impôt", "seulement les cotisations salariales"]', 0,
   'Le super-brut = brut + cotisations patronales : ce que le salarié coûte vraiment.', 8),
  ('15310000-0000-4000-8000-000000000309'::uuid, 'Lire sa fiche de paie',
   'Pour un salarié, le salaire net est plus élevé que le salaire brut.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le net est plus bas que le brut (d''environ 22 à 25 %), à cause des cotisations.', 9),
  ('15310000-0000-4000-8000-000000000310'::uuid, 'Lire sa fiche de paie',
   'Classe du plus grand au plus petit : coût employeur, brut, net.', 'mcq',
   '["coût employeur > brut > net", "net > brut > coût employeur", "brut > coût employeur > net", "ils sont égaux"]', 0,
   'Le super-brut dépasse le brut, qui dépasse le net versé au salarié.', 10)
) AS d(id, lesson, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Fiscalité'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = d.lesson
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
