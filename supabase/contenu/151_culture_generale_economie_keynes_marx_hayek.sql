-- =============================================================================
-- Studuel — Migration 151 : Culture générale — Économie (Keynes, Marx, Hayek)
--
-- ENRICHIT le thème « Économie » DÉJÀ EXISTANT (créé par la migration 150). On
-- NE recrée PAS la matière « Culture générale », NI le chapitre « Économie »,
-- NI la contrainte de catégorie : on ajoute seulement 3 LEÇONS (+ leurs quiz et
-- questions) au chapitre « Économie » du subject « culture-generale » (niveau
-- fixe « tous »). Après Adam Smith / Bastiat / Friedman (150), on complète avec
-- trois grandes figures : Keynes (relance par la demande), Marx (critique du
-- capitalisme) et Hayek (ordre spontané du marché).
--
-- PRÉREQUIS : 150 (matière « culture-generale » + chapitre « Économie »).
--             008 (subjects/chapters/lessons), 002 (quizzes/quiz_questions).
-- Idempotent (ON CONFLICT / gardes NOT EXISTS).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Trois nouvelles leçons du thème « Économie » (positions 4, 5, 6).
--    Un grand penseur par leçon (cours dans lessons.content).
-- -----------------------------------------------------------------------------
INSERT INTO public.lessons (chapter_id, title, content, position)
SELECT c.id, v.title, v.md, v.pos
FROM (VALUES
  ('John Maynard Keynes — relancer par la demande', $md$# John Maynard Keynes — relancer par la demande

## Qui est-il ?
**John Maynard Keynes** (1883-1946) est un économiste **britannique**, l'un des plus influents du XXe siècle. Son grand livre, la **« Théorie générale de l'emploi, de l'intérêt et de la monnaie »** (1936), écrit après la grande crise de 1929, bouleverse la façon de penser l'économie et l'action de l'État.

## 1. La demande globale, moteur de l'activité
Avant Keynes, beaucoup pensaient que le marché s'**auto-régule** toujours : en cas de chômage, les salaires et les prix baissent, et l'emploi repart tout seul. Keynes conteste cette idée.

Pour lui, ce qui commande la production et l'emploi, c'est la **demande globale** : la somme de ce que les ménages consomment, ce que les entreprises investissent et ce que l'État dépense. Quand cette demande est trop faible, les entreprises produisent moins, embauchent moins, et l'économie peut rester **durablement bloquée** dans le chômage.

## 2. La crise de 1929 et le rôle de l'État
Lors d'une **crise**, les ménages, inquiets, consomment moins et épargnent ; les entreprises, sans clients, cessent d'investir. La demande s'effondre, le chômage explose — et rien ne relance la machine tout seul.

La solution de Keynes : l'**État doit intervenir** pour relancer la demande. Il peut **dépenser** (grands travaux, routes, écoles), soutenir les revenus, baisser les impôts ou les taux d'intérêt. Ces dépenses publiques **remplacent** la demande privée qui manque et remettent l'économie en marche.

## 3. L'effet multiplicateur
L'idée est puissante : un euro dépensé par l'État en génère **plusieurs** dans l'économie. L'ouvrier payé pour construire une route dépense son salaire chez le boulanger, qui à son tour consomme, etc. C'est l'**effet multiplicateur** : la dépense initiale se propage de proche en proche et fait plus que se rembourser en activité.

> « À long terme, nous serons tous morts. » Par cette formule, Keynes raille ceux qui, face au chômage, se contentent d'attendre que le marché s'ajuste « à long terme » : il faut **agir maintenant**.

## 4. Un héritage immense
Les idées de Keynes inspirent les politiques de l'après-guerre : les **Trente Glorieuses** (1945-1975) et la construction de l'**État-providence** (protection sociale, services publics). On parle de politiques **keynésiennes** dès qu'un État relance l'activité par la dépense publique.

## L'essentiel à retenir
- Keynes (britannique, XXe s.), **« Théorie générale »** (1936).
- Le marché ne s'auto-régule **pas toujours** : le chômage peut durer.
- En **crise**, la **demande globale** s'effondre → l'**État doit relancer** (dépense publique, grands travaux).
- **Effet multiplicateur** : un euro public en génère plusieurs.
- Inspire les **Trente Glorieuses** et l'**État-providence**.$md$, 4),

  ('Karl Marx — la critique du capitalisme', $md$# Karl Marx — la critique du capitalisme

## Qui est-il ?
**Karl Marx** (1818-1883) est un philosophe, économiste et penseur **allemand**. Observateur du capitalisme industriel de son époque, il en propose une **analyse critique** parmi les plus influentes de l'histoire des idées. Son grand ouvrage d'économie s'intitule **« Le Capital »**.

## 1. Le travail et la plus-value
Au cœur de l'analyse de Marx : la **valeur** des marchandises vient du **travail** humain nécessaire pour les produire. Or l'ouvrier, dit Marx, produit dans sa journée **plus de valeur** que ce qu'il reçoit en salaire.

Cette différence, entre la valeur créée par le travailleur et le salaire qu'on lui verse, Marx l'appelle la **plus-value**. Elle est **captée par le capitaliste** (le propriétaire de l'usine et des machines). C'est, selon lui, la source du **profit** — et le mécanisme central de l'**exploitation** dans le capitalisme.

## 2. La lutte des classes
Marx analyse la société à travers l'opposition de deux grandes **classes** :
- la **bourgeoisie**, qui possède les **moyens de production** (usines, capitaux, terres) ;
- le **prolétariat**, qui ne possède que sa **force de travail** et doit la vendre pour vivre.

> « L'histoire de toute société jusqu'à nos jours est l'histoire de la lutte des classes. » (Manifeste, 1848)

Pour Marx, l'histoire est traversée par ce **conflit d'intérêts** entre ceux qui possèdent et ceux qui travaillent.

## 3. L'aliénation
Dans le travail industriel, l'ouvrier ne maîtrise ni ce qu'il produit, ni comment. Il devient un **rouage** de la machine, séparé du fruit de son travail. Marx nomme **aliénation** cette dépossession : le travailleur ne se **reconnaît plus** dans ce qu'il fait, son activité lui devient étrangère.

## 4. Le matérialisme historique
Marx propose une méthode : le **matérialisme historique**. Selon lui, ce sont d'abord les conditions **économiques** et matérielles (comment on produit, qui possède quoi) qui expliquent l'organisation d'une société — ses lois, ses idées, sa politique. L'**infrastructure** économique commande, pour une large part, la **superstructure** (droit, culture, institutions).

## L'essentiel à retenir
- Marx (allemand, XIXe s.), grand analyste critique du capitalisme, **« Le Capital »**.
- **Plus-value** : le capitaliste capte la valeur créée par le travailleur au-delà du salaire.
- **Lutte des classes** : bourgeoisie (possède les moyens de production) contre prolétariat.
- **Aliénation** : le travailleur est dépossédé du fruit et du sens de son travail.
- **Matérialisme historique** : l'économie explique en grande partie l'organisation sociale.$md$, 5),

  ('Friedrich Hayek — l''ordre spontané du marché', $md$# Friedrich Hayek — l'ordre spontané du marché

## Qui est-il ?
**Friedrich Hayek** (1899-1992) est un économiste et philosophe **autrichien**, figure de l'**école autrichienne** d'économie et **prix Nobel d'économie 1974**. Grand défenseur du libéralisme, il est le **contrepoint** de Keynes : là où Keynes veut relancer par l'État, Hayek se méfie de toute planification centrale.

## 1. L'ordre spontané
L'idée maîtresse de Hayek est celle d'**ordre spontané**. Un marché n'a **pas de chef** : personne, en haut, ne décide qui produit quoi, ni à quel prix. Et pourtant, un ordre **émerge** de lui-même, de millions de décisions individuelles qui s'ajustent les unes aux autres.

Comme une langue ou des règles de politesse, le marché est un ordre qui **n'a pas été inventé** par quelqu'un : il s'est **formé tout seul**, par l'expérience et l'échange. On peut le **coordonner sans le commander**.

## 2. La connaissance est dispersée
C'est l'argument le plus profond de Hayek. Le savoir utile à l'économie — ce dont les gens ont besoin, ce qui est rare, ce qui est possible — n'est **jamais réuni** dans une seule tête. Il est **dispersé** entre des millions d'individus, chacun connaissant sa petite situation locale.

Comment coordonner tout cela ? Grâce aux **prix**. Un prix qui monte signale une rareté ; un prix qui baisse, une abondance. Sans qu'on ait à tout expliquer, le **système de prix transmet l'information** et guide chacun vers les bonnes décisions.

> « La curieuse tâche de l'économie est de montrer aux hommes le peu de choses qu'ils croient pouvoir concevoir sur ce qu'ils imaginent pouvoir organiser. »

## 3. La critique de la planification centrale
D'où sa critique de la **planification centrale** : un État qui prétend **diriger** toute l'économie ne peut **pas** rassembler la connaissance dispersée. Il décidera à l'aveugle, mal, et avec du retard. Pour Hayek, c'est une erreur de conception, pas seulement de mise en œuvre.

## 4. « La Route de la servitude »
Dans **« La Route de la servitude »** (1944), Hayek va plus loin : vouloir tout planifier oblige à **concentrer le pouvoir**, ce qui menace peu à peu les **libertés individuelles**. La liberté économique et la liberté politique, dit-il, vont de pair.

## L'essentiel à retenir
- Hayek (autrichien, XXe s.), **école autrichienne**, **Nobel 1974**.
- **Ordre spontané** : le marché coordonne **sans chef**.
- La **connaissance est dispersée** ; les **prix** transmettent l'information.
- Critique de la **planification centrale** : nul ne peut centraliser tout le savoir.
- **« La Route de la servitude »** (1944) : trop planifier menace la liberté. Contrepoint libéral de Keynes.$md$, 6)
) AS v(title, md, pos)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Économie'
ON CONFLICT (chapter_id, title) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. Un quiz par leçon (rattaché via lesson_id), seulement si la leçon n'en a
--    pas déjà un. Quiz gratuits (culture générale accessible à tous).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Culture générale', 'tous', 'Économie', true, l.id
FROM (VALUES
  ('15119999-0000-4000-8000-000000000001'::uuid, 'John Maynard Keynes', 'John Maynard Keynes — relancer par la demande'),
  ('15119999-0000-4000-8000-000000000002'::uuid, 'Karl Marx', 'Karl Marx — la critique du capitalisme'),
  ('15119999-0000-4000-8000-000000000003'::uuid, 'Friedrich Hayek', 'Friedrich Hayek — l''ordre spontané du marché')
) AS v(quiz_id, title, lesson)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Économie'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = v.lesson
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. Questions (10 par quiz), attachées au quiz de la leçon via la jointure.
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- John Maynard Keynes
  ('15110000-0000-4000-8000-000000000101'::uuid, 'John Maynard Keynes — relancer par la demande',
   'Quel est l''ouvrage majeur de Keynes (1936) ?', 'mcq',
   '["La Théorie générale de l''emploi, de l''intérêt et de la monnaie", "Le Capital", "La Richesse des nations", "La Route de la servitude"]', 0,
   'La « Théorie générale » (1936), écrite après la crise de 1929.', 1),
  ('15110000-0000-4000-8000-000000000102'::uuid, 'John Maynard Keynes — relancer par la demande',
   'Selon Keynes, qu''est-ce qui commande la production et l''emploi ?', 'mcq',
   '["la demande globale", "la seule quantité de monnaie", "le hasard", "la taille de la population"]', 0,
   'Consommation + investissement + dépense publique : si la demande faiblit, l''emploi recule.', 2),
  ('15110000-0000-4000-8000-000000000103'::uuid, 'John Maynard Keynes — relancer par la demande',
   'Face à une crise, que doit faire l''État selon Keynes ?', 'mcq',
   '["relancer la demande (dépense publique, grands travaux)", "ne rien faire et attendre", "supprimer les dépenses publiques", "interdire l''épargne"]', 0,
   'La dépense publique remplace la demande privée qui manque et relance l''activité.', 3),
  ('15110000-0000-4000-8000-000000000104'::uuid, 'John Maynard Keynes — relancer par la demande',
   'Comment appelle-t-on le fait qu''un euro dépensé par l''État en génère plusieurs dans l''économie ?', 'mcq',
   '["l''effet multiplicateur", "l''effet de mode", "l''effet de serre", "l''effet cliquet"]', 0,
   'La dépense initiale se propage de proche en proche : c''est le multiplicateur.', 4),
  ('15110000-0000-4000-8000-000000000105'::uuid, 'John Maynard Keynes — relancer par la demande',
   'Keynes pensait que le marché s''auto-régule toujours tout seul.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : c''est justement l''idée qu''il conteste. Le chômage peut durer sans intervention.', 5),
  ('15110000-0000-4000-8000-000000000106'::uuid, 'John Maynard Keynes — relancer par la demande',
   'À quelle grande crise la pensée de Keynes répond-elle d''abord ?', 'mcq',
   '["la crise de 1929", "la peste noire", "la crise de 1789", "la bulle internet de 2000"]', 0,
   'La « Théorie générale » (1936) est écrite après la Grande Dépression des années 1930.', 6),
  ('15110000-0000-4000-8000-000000000107'::uuid, 'John Maynard Keynes — relancer par la demande',
   'Quelle période d''après-guerre les politiques keynésiennes ont-elles inspirée ?', 'mcq',
   '["les Trente Glorieuses", "la Renaissance", "la Belle Époque", "les années folles"]', 0,
   'Les Trente Glorieuses (1945-1975) et la construction de l''État-providence.', 7),
  ('15110000-0000-4000-8000-000000000108'::uuid, 'John Maynard Keynes — relancer par la demande',
   'De quelle nationalité était Keynes ?', 'mcq',
   '["britannique", "allemande", "américaine", "autrichienne"]', 0,
   'John Maynard Keynes (1883-1946) était britannique.', 8),
  ('15110000-0000-4000-8000-000000000109'::uuid, 'John Maynard Keynes — relancer par la demande',
   'Que veut dire Keynes par « À long terme, nous serons tous morts » ?', 'mcq',
   '["il faut agir maintenant, pas attendre que le marché s''ajuste", "il ne faut jamais rien faire", "l''économie est sans espoir", "l''épargne est inutile"]', 0,
   'Il raille ceux qui, face au chômage, se contentent d''attendre un ajustement lointain.', 9),
  ('15110000-0000-4000-8000-000000000110'::uuid, 'John Maynard Keynes — relancer par la demande',
   'Un modèle social développé dans le sillage de Keynes est…', 'mcq',
   '["l''État-providence", "l''autarcie totale", "le troc généralisé", "l''absence d''impôts"]', 0,
   'Protection sociale et services publics : l''État-providence de l''après-guerre.', 10),

  -- Karl Marx
  ('15110000-0000-4000-8000-000000000201'::uuid, 'Karl Marx — la critique du capitalisme',
   'Quel est le grand ouvrage d''économie de Marx ?', 'mcq',
   '["Le Capital", "La Richesse des nations", "La Théorie générale", "Capitalisme et liberté"]', 0,
   'Marx expose son analyse du capitalisme dans « Le Capital ».', 1),
  ('15110000-0000-4000-8000-000000000202'::uuid, 'Karl Marx — la critique du capitalisme',
   'Qu''appelle-t-on la « plus-value » chez Marx ?', 'mcq',
   '["la valeur créée par le travailleur au-delà de son salaire", "la TVA", "la hausse des prix", "les intérêts d''un prêt"]', 0,
   'Cette différence, captée par le capitaliste, est la source du profit selon Marx.', 2),
  ('15110000-0000-4000-8000-000000000203'::uuid, 'Karl Marx — la critique du capitalisme',
   'Selon Marx, d''où vient d''abord la valeur des marchandises ?', 'mcq',
   '["du travail humain nécessaire à leur production", "de la publicité", "de la chance", "de la couleur du produit"]', 0,
   'La valeur provient du travail incorporé dans la marchandise.', 3),
  ('15110000-0000-4000-8000-000000000204'::uuid, 'Karl Marx — la critique du capitalisme',
   'Quelles sont les deux grandes classes opposées chez Marx ?', 'mcq',
   '["la bourgeoisie et le prolétariat", "les nobles et le clergé", "les riches et les rois", "les paysans et les artisans"]', 0,
   'La bourgeoisie possède les moyens de production, le prolétariat vend sa force de travail.', 4),
  ('15110000-0000-4000-8000-000000000205'::uuid, 'Karl Marx — la critique du capitalisme',
   'Que possède la bourgeoisie, selon Marx ?', 'mcq',
   '["les moyens de production (usines, capitaux)", "seulement sa force de travail", "rien du tout", "uniquement des idées"]', 0,
   'C''est ce qui la distingue du prolétariat, qui ne possède que son travail.', 5),
  ('15110000-0000-4000-8000-000000000206'::uuid, 'Karl Marx — la critique du capitalisme',
   'Comment Marx nomme-t-il la dépossession du travailleur vis-à-vis de son travail ?', 'mcq',
   '["l''aliénation", "l''inflation", "la déflation", "la spéculation"]', 0,
   'L''ouvrier, réduit à un rouage, ne se reconnaît plus dans ce qu''il produit.', 6),
  ('15110000-0000-4000-8000-000000000207'::uuid, 'Karl Marx — la critique du capitalisme',
   'Complète : « L''histoire de toute société jusqu''à nos jours est l''histoire de la… »', 'mcq',
   '["lutte des classes", "conquête des mers", "marche vers la paix", "domination des rois"]', 0,
   'Formule d''ouverture du Manifeste (1848).', 7),
  ('15110000-0000-4000-8000-000000000208'::uuid, 'Karl Marx — la critique du capitalisme',
   'Que désigne le « matérialisme historique » ?', 'mcq',
   '["l''idée que les conditions économiques expliquent en grande partie la société", "le goût pour les objets matériels", "une théorie sur la matière en physique", "l''histoire des monuments"]', 0,
   'L''infrastructure économique commande pour une large part la superstructure (droit, culture).', 8),
  ('15110000-0000-4000-8000-000000000209'::uuid, 'Karl Marx — la critique du capitalisme',
   'De quelle nationalité était Karl Marx ?', 'mcq',
   '["allemande", "française", "russe", "anglaise"]', 0,
   'Karl Marx (1818-1883) était allemand.', 9),
  ('15110000-0000-4000-8000-000000000210'::uuid, 'Karl Marx — la critique du capitalisme',
   'Dans le capitalisme, le prolétariat vend surtout…', 'mcq',
   '["sa force de travail", "ses usines", "ses terres", "ses machines"]', 0,
   'Ne possédant pas les moyens de production, il doit vendre son travail pour vivre.', 10),

  -- Friedrich Hayek
  ('15110000-0000-4000-8000-000000000301'::uuid, 'Friedrich Hayek — l''ordre spontané du marché',
   'Que désigne l''« ordre spontané » chez Hayek ?', 'mcq',
   '["un ordre qui émerge sans chef, de millions de décisions", "un ordre imposé par l''État", "le désordre total", "un plan quinquennal"]', 0,
   'Comme une langue, le marché s''organise de lui-même, sans être commandé d''en haut.', 1),
  ('15110000-0000-4000-8000-000000000302'::uuid, 'Friedrich Hayek — l''ordre spontané du marché',
   'Selon Hayek, la connaissance utile à l''économie est…', 'mcq',
   '["dispersée entre des millions d''individus", "réunie dans une seule tête", "détenue par l''État", "inutile"]', 0,
   'Nul ne peut centraliser ce savoir local et éparpillé.', 2),
  ('15110000-0000-4000-8000-000000000303'::uuid, 'Friedrich Hayek — l''ordre spontané du marché',
   'Comment l''information circule-t-elle sur le marché, selon Hayek ?', 'mcq',
   '["par les prix", "par la télévision", "par décret", "par le hasard"]', 0,
   'Un prix qui monte signale une rareté, un prix qui baisse une abondance.', 3),
  ('15110000-0000-4000-8000-000000000304'::uuid, 'Friedrich Hayek — l''ordre spontané du marché',
   'Que critique surtout Hayek ?', 'mcq',
   '["la planification centrale de l''économie", "le libre-échange", "l''existence des prix", "la propriété privée"]', 0,
   'Un État planificateur ne peut pas rassembler la connaissance dispersée.', 4),
  ('15110000-0000-4000-8000-000000000305'::uuid, 'Friedrich Hayek — l''ordre spontané du marché',
   'Quel est le livre célèbre de Hayek (1944) ?', 'mcq',
   '["La Route de la servitude", "Le Capital", "La Théorie générale", "La Richesse des nations"]', 0,
   '« La Route de la servitude » (1944) met en garde contre l''excès de planification.', 5),
  ('15110000-0000-4000-8000-000000000306'::uuid, 'Friedrich Hayek — l''ordre spontané du marché',
   'À quelle école de pensée Hayek est-il rattaché ?', 'mcq',
   '["l''école autrichienne", "l''école de Chicago", "l''école de Francfort", "les physiocrates"]', 0,
   'Hayek est une grande figure de l''école autrichienne d''économie.', 6),
  ('15110000-0000-4000-8000-000000000307'::uuid, 'Friedrich Hayek — l''ordre spontané du marché',
   'Quelle distinction Hayek a-t-il reçue en 1974 ?', 'mcq',
   '["le prix Nobel d''économie", "le prix Nobel de littérature", "la médaille Fields", "aucune"]', 0,
   'Prix Nobel d''économie 1974.', 7),
  ('15110000-0000-4000-8000-000000000308'::uuid, 'Friedrich Hayek — l''ordre spontané du marché',
   'Selon « La Route de la servitude », vouloir tout planifier tend à…', 'mcq',
   '["concentrer le pouvoir et menacer les libertés", "renforcer les libertés", "supprimer l''État", "enrichir tout le monde"]', 0,
   'Pour Hayek, liberté économique et liberté politique vont de pair.', 8),
  ('15110000-0000-4000-8000-000000000309'::uuid, 'Friedrich Hayek — l''ordre spontané du marché',
   'Un seul planificateur central peut connaître tout ce qu''il faut pour diriger l''économie.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : c''est justement ce que Hayek conteste — la connaissance est dispersée.', 9),
  ('15110000-0000-4000-8000-000000000310'::uuid, 'Friedrich Hayek — l''ordre spontané du marché',
   'De quel économiste Hayek est-il souvent présenté comme le contrepoint libéral ?', 'mcq',
   '["Keynes", "Adam Smith", "Bastiat", "Friedman"]', 0,
   'Là où Keynes veut relancer par l''État, Hayek se méfie de toute planification.', 10)
) AS d(id, lesson, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Économie'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = d.lesson
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
