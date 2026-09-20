-- =============================================================================
-- Studuel — Migration 128 : CONTENU SES 2de (cours + carte mentale + quiz)
-- Remplit les 4 chapitres de SES 2de (programme officiel de seconde) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder existant)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (positions 4→10). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons SES 2de, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Comment raisonnent les économistes ?', $md$# Comment raisonnent les économistes ?

## Ce que tu vas comprendre
L'économie est une science sociale qui étudie la façon dont les sociétés utilisent des ressources **rares** pour satisfaire des besoins **illimités**. Ce chapitre te montre comment l'économiste **raisonne** : il observe, modélise et mesure.

## 1. Une science qui part de la rareté
Les ressources (temps, argent, matières premières) sont **limitées**, mais les besoins des individus sont **illimités**. L'économie étudie donc les **choix** que font les agents face à cette **rareté**.

*Exemple : avec un budget de 20 €, un élève ne peut pas à la fois acheter un livre et aller au cinéma tous les jours : il doit choisir.*

## 2. Le coût d'opportunité
Faire un choix, c'est **renoncer** à un autre. Le **coût d'opportunité** d'une décision, c'est la valeur de ce à quoi on renonce (la meilleure option abandonnée).

*Exemple : passer une soirée à réviser a pour coût d'opportunité la sortie entre amis à laquelle on renonce.*

## 3. L'utilité et les choix rationnels
On suppose que les agents cherchent à **maximiser leur utilité**, c'est-à-dire la satisfaction qu'ils retirent de leurs choix. L'agent est dit **rationnel** quand il compare avantages et coûts avant de décider.

## 4. Le modèle et la démarche scientifique
Pour comprendre le réel, l'économiste construit un **modèle** : une représentation **simplifiée** qui isole quelques variables. Il formule une hypothèse, puis la **confronte aux faits**.

> **À retenir :** un modèle n'est pas la réalité ; c'est un outil qui simplifie pour mieux expliquer et prévoir.

## 5. Les données et la mesure
L'économiste s'appuie sur des **données** chiffrées (statistiques de l'Insee, enquêtes). Il mobilise des outils comme les **pourcentages**, les **taux de variation** et les **moyennes** pour décrire et comparer les phénomènes.

## L'essentiel à retenir
- L'économie étudie les **choix** face à la **rareté** des ressources.
- Tout choix a un **coût d'opportunité** : ce à quoi on renonce.
- Les agents sont supposés **rationnels** et cherchent à maximiser leur **utilité**.
- L'économiste raisonne avec des **modèles** (représentations simplifiées) et des **données** chiffrées.$md$),

    ('La production', $md$# La production

## Ce que tu vas comprendre
Produire, c'est créer des **biens** et des **services** destinés à satisfaire des besoins. Ce chapitre t'explique qui produit, avec quels moyens, et comment on mesure la richesse réellement créée.

## 1. Qu'est-ce que la production ?
La **production** est l'activité qui consiste à créer des biens (objets matériels) et des services (prestations immatérielles) en combinant des ressources. On distingue la production **marchande** (vendue sur un marché à un prix qui couvre les coûts) de la production **non marchande** (fournie gratuitement ou quasi gratuitement, comme l'école publique).

## 2. Les facteurs de production
Pour produire, on combine deux **facteurs de production** :
- le **travail** : l'activité des personnes (heures travaillées, qualifications) ;
- le **capital** : les moyens durables de production (machines, bâtiments, outils, aussi appelé capital **fixe**).

*Exemple : une boulangerie combine le travail du boulanger et le capital que sont le four et le pétrin.*

## 3. La productivité
La **productivité** mesure l'**efficacité** de la production : c'est le rapport entre la quantité produite et les facteurs utilisés.

- Productivité du travail = production ÷ quantité de travail.

Quand la productivité augmente, on produit **plus** avec **autant** de facteurs. Le **progrès technique** et la **formation** l'améliorent.

## 4. Qui produit ? Les organisations
La production est assurée par différentes **organisations productives** : les **entreprises** (privées, but lucratif), les **administrations publiques** (services non marchands), et les **associations** (but non lucratif).

## 5. La valeur ajoutée
La richesse réellement créée par un producteur est la **valeur ajoutée** :

**Valeur ajoutée = valeur de la production − consommations intermédiaires**

Les **consommations intermédiaires** sont les biens et services détruits ou transformés au cours de la production (farine, électricité…).

*Exemple : un menuisier vend une table 200 € ; il a utilisé 60 € de bois. Sa valeur ajoutée est de 200 − 60 = 140 €.*

## L'essentiel à retenir
- Produire = créer des **biens** et **services** (production **marchande** ou **non marchande**).
- On combine deux **facteurs** : le **travail** et le **capital**.
- La **productivité** mesure l'efficacité : produire plus avec autant de facteurs.
- La **valeur ajoutée** = production − consommations intermédiaires ; c'est la richesse réellement créée.$md$),

    ('Comment se forment les prix ?', $md$# Comment se forment les prix ?

## Ce que tu vas comprendre
Sur un marché, le **prix** n'est pas fixé au hasard : il résulte de la rencontre entre ceux qui veulent acheter et ceux qui veulent vendre. Ce chapitre t'explique la mécanique de l'**offre**, de la **demande** et de l'**équilibre**.

## 1. Le marché
Un **marché** est un lieu (réel ou virtuel) de rencontre entre l'**offre** et la **demande** d'un bien ou d'un service, où se fixe un **prix**. On parle de marché **concurrentiel** quand de nombreux acheteurs et vendeurs s'y confrontent librement.

## 2. La demande
La **demande** représente la quantité qu'un bien que les consommateurs souhaitent acheter à chaque prix. En général, **quand le prix baisse, la demande augmente** (et inversement) : c'est la **loi de la demande**. La courbe de demande est **décroissante**.

## 3. L'offre
L'**offre** représente la quantité qu'un bien que les producteurs acceptent de vendre à chaque prix. En général, **quand le prix monte, l'offre augmente** (produire devient plus rémunérateur) : la courbe d'offre est **croissante**.

## 4. L'équilibre du marché
Le **prix d'équilibre** est le prix pour lequel la **quantité offerte est égale à la quantité demandée**. C'est le point où les deux courbes se croisent.

- Si le prix est **trop haut** : l'offre dépasse la demande → **surplus** (invendus), le prix tend à baisser.
- Si le prix est **trop bas** : la demande dépasse l'offre → **pénurie**, le prix tend à monter.

> **À retenir :** le marché est un mécanisme d'ajustement : le prix bouge jusqu'à ce que offre et demande s'égalisent.

## 5. Les variations de prix
Un choc peut **déplacer** l'offre ou la demande, ce qui modifie le prix d'équilibre.

*Exemple : une gelée détruit une partie de la récolte de fraises. L'offre baisse : à demande inchangée, le prix des fraises **augmente**.*

## L'essentiel à retenir
- Un **marché** est la rencontre de l'**offre** et de la **demande**, où se forme un **prix**.
- **Demande décroissante** (prix bas → on achète plus) ; **offre croissante** (prix haut → on vend plus).
- Le **prix d'équilibre** égalise quantité offerte et quantité demandée.
- Un choc sur l'offre ou la demande **déplace** l'équilibre et **fait varier** le prix.$md$),

    ('La socialisation', $md$# La socialisation

## Ce que tu vas comprendre
On ne naît pas membre d'une société, on le devient. La **socialisation** est le processus par lequel un individu apprend et intériorise les manières de penser, de sentir et d'agir de son groupe. Ce chapitre t'explique comment et par qui.

## 1. Qu'est-ce que la socialisation ?
La **socialisation** est le processus par lequel un individu **apprend** et **intériorise** les **normes** et les **valeurs** de la société, ce qui lui permet de vivre en groupe et de construire son identité.

## 2. Normes et valeurs
- Les **valeurs** sont des idéaux, des principes que l'on juge importants (le respect, l'égalité, la solidarité, la réussite).
- Les **normes** sont des règles de conduite qui traduisent ces valeurs en comportements attendus (dire bonjour, respecter le code de la route).

*Exemple : la valeur « politesse » se traduit par la norme « on ne coupe pas la parole ».*

## 3. Les instances de socialisation
La socialisation passe par plusieurs **instances** (les agents qui transmettent) :
- la **famille** : première instance, transmet le langage, les habitudes, les premières valeurs ;
- l'**école** : transmet des savoirs mais aussi des règles de vie collective ;
- les **groupes de pairs** (les amis) et les **médias** jouent aussi un rôle important.

## 4. Socialisation primaire et secondaire
- La **socialisation primaire** a lieu pendant l'**enfance** ; elle est intense et durable (famille, école).
- La **socialisation secondaire** se poursuit à l'**âge adulte** (travail, conjoint, associations) ; elle peut compléter ou transformer les acquis de l'enfance.

## 5. Une socialisation différenciée
La socialisation n'est pas identique pour tous : elle diffère selon le **genre** (on n'apprend pas toujours les mêmes choses aux filles et aux garçons) et selon le **milieu social** d'origine. On parle de **socialisation différenciée**.

*Exemple : offrir des jouets différents aux filles et aux garçons contribue à une socialisation genrée.*

## L'essentiel à retenir
- La **socialisation** = apprentissage et intériorisation des **normes** et **valeurs**.
- **Valeurs** = idéaux ; **normes** = règles de conduite concrètes.
- Instances principales : **famille**, **école**, groupes de **pairs**, **médias**.
- Socialisation **primaire** (enfance) puis **secondaire** (âge adulte) ; elle est **différenciée** selon le genre et le milieu social.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'ses'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Comment raisonnent les économistes ?', $json${
      "centre": "Comment raisonnent les économistes ?",
      "branches": [
        { "titre": "Rareté et choix", "enfants": ["Ressources limitées", "Besoins illimités", "Il faut choisir"] },
        { "titre": "Coût d'opportunité", "enfants": ["Choisir = renoncer", "Valeur de l'option abandonnée", "Réviser vs sortir"] },
        { "titre": "Agent rationnel", "enfants": ["Maximiser son utilité", "Comparer avantages et coûts", "Satisfaction retirée"] },
        { "titre": "Modèle et données", "enfants": ["Représentation simplifiée", "Hypothèse confrontée aux faits", "Statistiques, pourcentages"] }
      ]
    }$json$),
    ('La production', $json${
      "centre": "La production",
      "branches": [
        { "titre": "Produire", "enfants": ["Biens et services", "Marchande / non marchande", "Satisfaire des besoins"] },
        { "titre": "Facteurs", "enfants": ["Travail (les personnes)", "Capital (machines, bâtiments)", "On les combine"] },
        { "titre": "Productivité", "enfants": ["Production ÷ facteurs", "Plus avec autant", "Progrès technique, formation"] },
        { "titre": "Valeur ajoutée", "enfants": ["Production − conso intermédiaires", "Richesse réellement créée", "Table 200 − bois 60 = 140"] }
      ]
    }$json$),
    ('Comment se forment les prix ?', $json${
      "centre": "Comment se forment les prix ?",
      "branches": [
        { "titre": "Le marché", "enfants": ["Rencontre offre / demande", "Un prix s'y fixe", "Marché concurrentiel"] },
        { "titre": "La demande", "enfants": ["Ce que veulent les acheteurs", "Prix baisse → demande monte", "Courbe décroissante"] },
        { "titre": "L'offre", "enfants": ["Ce que veulent vendre les producteurs", "Prix monte → offre monte", "Courbe croissante"] },
        { "titre": "L'équilibre", "enfants": ["Offre = demande", "Trop haut → surplus", "Trop bas → pénurie"] }
      ]
    }$json$),
    ('La socialisation', $json${
      "centre": "La socialisation",
      "branches": [
        { "titre": "Le processus", "enfants": ["Apprendre et intérioriser", "Vivre en groupe", "Construire son identité"] },
        { "titre": "Normes et valeurs", "enfants": ["Valeurs = idéaux", "Normes = règles de conduite", "Politesse → ne pas couper la parole"] },
        { "titre": "Les instances", "enfants": ["La famille (première)", "L'école", "Pairs et médias"] },
        { "titre": "Primaire / secondaire", "enfants": ["Primaire : enfance", "Secondaire : âge adulte", "Socialisation différenciée"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'ses'
 WHERE c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (Ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'SES', '2de', v.chapter, true, l.id
FROM (VALUES
  ('12819999-0000-4000-8000-000000000001'::uuid, 'Comment raisonnent les économistes ?'),
  ('12819999-0000-4000-8000-000000000002'::uuid, 'La production'),
  ('12819999-0000-4000-8000-000000000003'::uuid, 'Comment se forment les prix ?'),
  ('12819999-0000-4000-8000-000000000004'::uuid, 'La socialisation')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'ses'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
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
  -- Chapitre 1 — Comment raisonnent les économistes ?
  ('12810000-0000-4000-8000-000000000104'::uuid, 'Comment raisonnent les économistes ?',
   'Sur quel constat de départ repose le raisonnement économique ?', 'mcq',
   '["Des ressources rares face à des besoins illimités", "Des ressources illimitées", "L''absence de choix", "L''égalité des revenus"]', 0,
   'L''économie étudie les choix que font les agents face à la rareté des ressources.', 4),
  ('12810000-0000-4000-8000-000000000105'::uuid, 'Comment raisonnent les économistes ?',
   'Qu''appelle-t-on le coût d''opportunité d''un choix ?', 'mcq',
   '["La valeur de ce à quoi on renonce", "Le prix payé en euros", "Un impôt sur la consommation", "Le coût de fabrication"]', 0,
   'Le coût d''opportunité est la valeur de la meilleure option à laquelle on renonce en faisant un choix.', 5),
  ('12810000-0000-4000-8000-000000000106'::uuid, 'Comment raisonnent les économistes ?',
   'Un agent économique rationnel cherche à maximiser son utilité.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On suppose que l''agent rationnel compare avantages et coûts pour maximiser sa satisfaction (son utilité).', 6),
  ('12810000-0000-4000-8000-000000000107'::uuid, 'Comment raisonnent les économistes ?',
   'Qu''est-ce qu''un modèle en économie ?', 'mcq',
   '["Une représentation simplifiée de la réalité", "Une copie exacte de la réalité", "Une opinion personnelle", "Une loi votée au Parlement"]', 0,
   'Un modèle simplifie le réel en isolant quelques variables pour mieux l''expliquer et le prévoir.', 7),
  ('12810000-0000-4000-8000-000000000108'::uuid, 'Comment raisonnent les économistes ?',
   'Un modèle économique est une reproduction exacte et complète de la réalité.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : un modèle est une représentation simplifiée, pas une copie exacte du réel.', 8),
  ('12810000-0000-4000-8000-000000000109'::uuid, 'Comment raisonnent les économistes ?',
   'Pour analyser un phénomène, l''économiste s''appuie notamment sur : ', 'mcq',
   '["Des données chiffrées (statistiques)", "Uniquement son intuition", "Des sondages d''opinion politiques", "Le hasard"]', 0,
   'L''économiste mobilise des données chiffrées (Insee, enquêtes) et des outils comme les taux de variation.', 9),
  ('12810000-0000-4000-8000-000000000110'::uuid, 'Comment raisonnent les économistes ?',
   'Faire un choix économique implique nécessairement de renoncer à autre chose.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À cause de la rareté, choisir une option revient à renoncer à une autre : c''est le coût d''opportunité.', 10),

  -- Chapitre 2 — La production
  ('12810000-0000-4000-8000-000000000204'::uuid, 'La production',
   'Quels sont les deux facteurs de production ?', 'mcq',
   '["Le travail et le capital", "L''offre et la demande", "Le prix et la quantité", "Les normes et les valeurs"]', 0,
   'On produit en combinant le facteur travail (les personnes) et le facteur capital (machines, bâtiments).', 4),
  ('12810000-0000-4000-8000-000000000205'::uuid, 'La production',
   'Comment calcule-t-on la valeur ajoutée ?', 'mcq',
   '["Production − consommations intermédiaires", "Production + salaires", "Prix × quantité", "Travail + capital"]', 0,
   'La valeur ajoutée = valeur de la production − consommations intermédiaires ; c''est la richesse réellement créée.', 5),
  ('12810000-0000-4000-8000-000000000206'::uuid, 'La production',
   'Un menuisier vend une table 200 € en ayant utilisé 60 € de bois. Sa valeur ajoutée est : ', 'mcq',
   '["140 €", "260 €", "200 €", "60 €"]', 0,
   'Valeur ajoutée = 200 − 60 = 140 €.', 6),
  ('12810000-0000-4000-8000-000000000207'::uuid, 'La production',
   'L''école publique est un exemple de production non marchande.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La production non marchande est fournie gratuitement ou quasi gratuitement : c''est le cas de l''école publique.', 7),
  ('12810000-0000-4000-8000-000000000208'::uuid, 'La production',
   'Que mesure la productivité ?', 'mcq',
   '["L''efficacité de la production", "Le prix de vente", "Le nombre d''entreprises", "Le montant des impôts"]', 0,
   'La productivité rapporte la quantité produite aux facteurs utilisés : elle mesure l''efficacité.', 8),
  ('12810000-0000-4000-8000-000000000209'::uuid, 'La production',
   'Le capital fixe désigne les moyens durables de production comme les machines et les bâtiments.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le capital fixe regroupe les biens durables utilisés pour produire : machines, bâtiments, outils.', 9),
  ('12810000-0000-4000-8000-000000000210'::uuid, 'La production',
   'Quand la productivité du travail augmente, on produit : ', 'mcq',
   '["Plus avec autant de travail", "Moins avec plus de travail", "La même chose avec plus de travail", "Rien de plus"]', 0,
   'Une hausse de la productivité permet de produire davantage avec la même quantité de facteurs.', 10),

  -- Chapitre 3 — Comment se forment les prix ?
  ('12810000-0000-4000-8000-000000000304'::uuid, 'Comment se forment les prix ?',
   'Qu''est-ce qu''un marché ?', 'mcq',
   '["Un lieu de rencontre entre l''offre et la demande", "Un magasin uniquement", "Une administration publique", "Une usine de production"]', 0,
   'Un marché est le lieu (réel ou virtuel) de rencontre entre l''offre et la demande, où se fixe un prix.', 4),
  ('12810000-0000-4000-8000-000000000305'::uuid, 'Comment se forment les prix ?',
   'En général, lorsque le prix d''un bien baisse, la demande : ', 'mcq',
   '["Augmente", "Diminue", "Reste identique", "Devient nulle"]', 0,
   'Loi de la demande : quand le prix baisse, la quantité demandée augmente (courbe décroissante).', 5),
  ('12810000-0000-4000-8000-000000000306'::uuid, 'Comment se forment les prix ?',
   'En général, lorsque le prix monte, les producteurs offrent une quantité plus grande.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La courbe d''offre est croissante : un prix plus élevé rend la production plus rémunératrice, donc l''offre augmente.', 6),
  ('12810000-0000-4000-8000-000000000307'::uuid, 'Comment se forment les prix ?',
   'À quoi correspond le prix d''équilibre ?', 'mcq',
   '["Le prix où quantité offerte = quantité demandée", "Le prix le plus bas possible", "Le prix fixé par l''État", "Le prix le plus élevé"]', 0,
   'Le prix d''équilibre est celui pour lequel la quantité offerte est égale à la quantité demandée.', 7),
  ('12810000-0000-4000-8000-000000000308'::uuid, 'Comment se forment les prix ?',
   'Si le prix est trop élevé, l''offre dépasse la demande et il apparaît : ', 'mcq',
   '["Un surplus (des invendus)", "Une pénurie", "Un équilibre", "Une hausse de la demande"]', 0,
   'Un prix trop haut crée un surplus (offre > demande) ; le prix tend alors à baisser.', 8),
  ('12810000-0000-4000-8000-000000000309'::uuid, 'Comment se forment les prix ?',
   'Une gelée détruit une partie de la récolte de fraises. À demande inchangée, le prix des fraises : ', 'mcq',
   '["Augmente", "Baisse", "Ne change pas", "Devient nul"]', 0,
   'L''offre baisse ; à demande inchangée, le prix d''équilibre augmente.', 9),
  ('12810000-0000-4000-8000-000000000310'::uuid, 'Comment se forment les prix ?',
   'Sur un marché concurrentiel, un seul vendeur fixe seul le prix.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : un marché concurrentiel réunit de nombreux acheteurs et vendeurs ; le prix résulte de leur confrontation.', 10),

  -- Chapitre 4 — La socialisation
  ('12810000-0000-4000-8000-000000000404'::uuid, 'La socialisation',
   'Qu''est-ce que la socialisation ?', 'mcq',
   '["Le processus d''apprentissage des normes et valeurs", "Le fait de se faire des amis", "Une activité économique", "Un réseau social en ligne"]', 0,
   'La socialisation est le processus par lequel un individu apprend et intériorise les normes et valeurs de la société.', 4),
  ('12810000-0000-4000-8000-000000000405'::uuid, 'La socialisation',
   'Quelle est la différence entre une valeur et une norme ?', 'mcq',
   '["La valeur est un idéal, la norme une règle de conduite", "Elles sont identiques", "La norme est un idéal, la valeur une règle", "La valeur est une loi, la norme un impôt"]', 0,
   'Les valeurs sont des idéaux (le respect, l''égalité) ; les normes traduisent ces valeurs en règles de conduite concrètes.', 5),
  ('12810000-0000-4000-8000-000000000406'::uuid, 'La socialisation',
   'La famille est généralement la première instance de socialisation.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La famille est la première instance : elle transmet le langage, les habitudes et les premières valeurs.', 6),
  ('12810000-0000-4000-8000-000000000407'::uuid, 'La socialisation',
   'La socialisation qui a lieu pendant l''enfance s''appelle : ', 'mcq',
   '["La socialisation primaire", "La socialisation secondaire", "La socialisation marchande", "La socialisation finale"]', 0,
   'La socialisation primaire se déroule pendant l''enfance (famille, école) ; la secondaire se poursuit à l''âge adulte.', 7),
  ('12810000-0000-4000-8000-000000000408'::uuid, 'La socialisation',
   'Laquelle de ces instances participe à la socialisation ?', 'mcq',
   '["L''école", "Le prix d''équilibre", "La valeur ajoutée", "Le coût d''opportunité"]', 0,
   'L''école est une instance de socialisation, comme la famille, les groupes de pairs et les médias.', 8),
  ('12810000-0000-4000-8000-000000000409'::uuid, 'La socialisation',
   'La socialisation est exactement identique pour tous les individus.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la socialisation est différenciée selon le genre et le milieu social d''origine.', 9),
  ('12810000-0000-4000-8000-000000000410'::uuid, 'La socialisation',
   'Offrir des jouets différents aux filles et aux garçons est un exemple de : ', 'mcq',
   '["Socialisation différenciée (genrée)", "Socialisation secondaire", "Production non marchande", "Coût d''opportunité"]', 0,
   'Transmettre des rôles différents selon le sexe relève de la socialisation différenciée (ici genrée).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'ses'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
