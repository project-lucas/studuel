-- =============================================================================
-- Studuel — Migration 150 : dossier « CULTURE GÉNÉRALE » + thème « Économie »
--
-- Nouveau dossier HORS-PROGRAMME présenté dans Réviser comme une matière. En
-- cliquant, l'élève accède à plusieurs THÈMES (ici « Économie »), chaque thème
-- contenant des leçons (cours + quiz). Contrairement aux matières classiques,
-- ce dossier est HORS-NIVEAU : ses chapitres/thèmes vivent au niveau fixe
-- « tous » et s'affichent pour toutes les classes (6e→Tle).
--   - subjects.fixed_level : quand renseigné, la page matière lit les chapitres
--     à CE niveau au lieu de la classe de l'élève (voir app/reviser/[subject]).
--   - Thème « Économie » = grands penseurs libéraux HORS programme scolaire
--     (Adam Smith, Frédéric Bastiat, Milton Friedman) — d'où le rangement en
--     culture générale plutôt qu'en SES.
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 002 (quizzes/quiz_questions).
-- Idempotent (ON CONFLICT / IS DISTINCT FROM / gardes NOT EXISTS).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Matière hors-niveau : colonne fixed_level + catégorie « culture ».
-- -----------------------------------------------------------------------------
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS fixed_level TEXT;

ALTER TABLE public.subjects DROP CONSTRAINT IF EXISTS subjects_category_check;
ALTER TABLE public.subjects ADD CONSTRAINT subjects_category_check
  CHECK (category IN ('college', 'tronc_commun', 'specialite', 'option', 'culture'));

-- -----------------------------------------------------------------------------
-- 1. La matière « Culture générale » (visible à toutes les classes).
-- -----------------------------------------------------------------------------
INSERT INTO public.subjects (slug, name, icon, color, category, levels, fixed_level)
VALUES ('culture-generale', 'Culture générale', '🧠', 'indigo', 'culture',
        '{6e,5e,4e,3e,2de,1re,Tle}', 'tous')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color,
      category = 'culture', levels = EXCLUDED.levels, fixed_level = 'tous';

-- -----------------------------------------------------------------------------
-- 2. Thème « Économie » (chapitre au niveau fixe « tous »).
-- -----------------------------------------------------------------------------
INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, 'tous', 'Économie', 1
FROM public.subjects s WHERE s.slug = 'culture-generale'
ON CONFLICT (subject_id, level, title) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. Leçons du thème : un grand penseur par leçon (cours dans lessons.content).
-- -----------------------------------------------------------------------------
INSERT INTO public.lessons (chapter_id, title, content, position)
SELECT c.id, v.title, v.md, v.pos
FROM (VALUES
  ('Adam Smith — la main invisible', $md$# Adam Smith — la main invisible

## Qui est-il ?
**Adam Smith** (1723-1790) est un philosophe écossais des Lumières, considéré comme le **père de l'économie moderne**. Son grand livre, **« Recherches sur la nature et les causes de la richesse des nations »** (1776), fonde l'économie politique comme science.

## 1. La division du travail
Smith commence par un exemple célèbre : la **fabrique d'épingles**. Un ouvrier seul, qui ferait tout, produirait à peine quelques épingles par jour. Mais si le travail est **divisé** en étapes (tirer le fil, le couper, l'aiguiser, poser la tête…), dix ouvriers spécialisés en produisent **des milliers**. La **spécialisation** décuple la **productivité** : c'est le moteur de la richesse.

## 2. La « main invisible »
C'est l'idée la plus connue de Smith. Chacun, en cherchant **son propre intérêt**, contribue **sans le vouloir** à l'intérêt de tous.

> « Ce n'est pas de la bienveillance du boucher, du brasseur ou du boulanger que nous attendons notre dîner, mais du soin qu'ils apportent à leurs propres intérêts. »

Le boulanger ne fait pas du pain par gentillesse, mais pour gagner sa vie — et pourtant il te nourrit. Le **marché**, comme une « main invisible », transforme la somme des intérêts individuels en **bien commun**, sans qu'un chef d'orchestre le décide.

## 3. Le marché et l'échange
Pour Smith, la **liberté d'échanger** et la **concurrence** permettent d'allouer les ressources mieux qu'un pouvoir central. Il défend le **libre-échange** entre nations : chaque pays gagne à se spécialiser dans ce qu'il fait le mieux.

## 4. Smith n'est pas un apôtre de l'égoïsme
Attention au contresens : Smith est aussi l'auteur de la **« Théorie des sentiments moraux »** (1759), où il montre que l'être humain est mû par la **sympathie** (la capacité à se mettre à la place d'autrui). Le marché ne fonctionne bien que dans un cadre de **règles morales et de justice**.

## L'essentiel à retenir
- Adam Smith (XVIIIe s.) = **père de l'économie moderne**, « La Richesse des nations » (1776).
- La **division du travail** augmente énormément la productivité (les épingles).
- La **main invisible** : la recherche de l'intérêt personnel sert, sans le vouloir, l'intérêt général.
- Il défend le **marché**, la **concurrence** et le **libre-échange** — dans un cadre moral.$md$, 1),

  ('Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas', $md$# Frédéric Bastiat — ce qu'on voit et ce qu'on ne voit pas

## Qui est-il ?
**Frédéric Bastiat** (1801-1850) est un économiste et **pamphlétaire** français, libéral et libre-échangiste, célèbre pour ses textes courts, drôles et redoutablement clairs. Son arme : démonter les **fausses évidences** en économie.

## 1. Le sophisme de la vitre cassée
C'est son exemple le plus fameux (« Ce qu'on voit et ce qu'on ne voit pas », 1850). Un garçon casse une vitre. Les passants se consolent : « Heureusement, cela fait vivre le vitrier ! » On **voit** le vitrier gagner de l'argent.

Mais **ce qu'on ne voit pas**, c'est que le père, pour payer la vitre, ne pourra pas acheter les chaussures ou le livre qu'il voulait. La richesse n'a pas augmenté : elle a seulement été **déplacée** — et une vitre a été détruite. **La destruction n'enrichit jamais.**

> Leçon : un bon économiste regarde **les effets cachés et indirects**, pas seulement l'effet visible immédiat.

## 2. La pétition des fabricants de chandelles
Pour ridiculiser le **protectionnisme**, Bastiat imagine une pétition satirique : les fabricants de bougies demandent à l'État d'**interdire le soleil** (fermer volets et fenêtres), car cette « concurrence déloyale » d'un astre qui éclaire **gratuitement** ruine leur industrie ! L'absurdité saute aux yeux : protéger un producteur, c'est appauvrir tous les consommateurs.

## 3. La Loi et la « spoliation légale »
Dans **« La Loi »** (1850), Bastiat affirme que la loi a un seul rôle légitime : **protéger la liberté, la personne et la propriété**. Quand la loi sert à **prendre aux uns pour donner aux autres**, elle devient une **spoliation légale** qui pervertit la justice.

> « L'État, c'est la grande fiction à travers laquelle tout le monde s'efforce de vivre aux dépens de tout le monde. »

## L'essentiel à retenir
- Bastiat (XIXe s.) = économiste **libéral** et **pamphlétaire** français.
- **La vitre cassée** : la destruction n'enrichit pas ; il faut voir les **coûts cachés**.
- **Les fabricants de chandelles** : satire du **protectionnisme**.
- **« La Loi »** : la loi doit protéger la liberté, pas organiser la **spoliation légale**.$md$, 2),

  ('Milton Friedman — monnaie et liberté', $md$# Milton Friedman — monnaie et liberté

## Qui est-il ?
**Milton Friedman** (1912-2006) est un économiste américain, figure de l'**école de Chicago** et **prix Nobel d'économie 1976**. Grand défenseur du marché libre, il a marqué le XXe siècle par ses idées sur la **monnaie** et la **liberté**.

## 1. Le monétarisme
Friedman relance l'étude de la **monnaie**. Sa thèse la plus célèbre :

> « L'inflation est toujours et partout un phénomène **monétaire**. »

Autrement dit : quand les prix s'envolent, c'est d'abord parce qu'on a créé **trop de monnaie** par rapport aux biens produits. Pour maîtriser l'inflation, il faut donc **contrôler la masse monétaire** — ce courant s'appelle le **monétarisme**.

## 2. Capitalisme et liberté
Dans **« Capitalisme et liberté »** (1962) puis **« La liberté du choix »**, Friedman défend l'idée que la **liberté économique** (choisir son travail, entreprendre, échanger) est une **condition de la liberté politique**. Concentrer le pouvoir économique dans l'État, c'est menacer les libertés individuelles.

## 3. « Il n'y a pas de repas gratuit »
Sa formule culte, *« There is no such thing as a free lunch »*, rappelle que **tout a un coût** : une dépense publique « gratuite » est en réalité payée par quelqu'un (impôts, dette, inflation). Rien n'est offert sans contrepartie.

## 4. Les quatre façons de dépenser l'argent
Friedman distingue quatre cas, du plus au moins efficace :
1. **Mon** argent pour **moi** : je fais attention au prix ET à la qualité.
2. Mon argent pour **les autres** (un cadeau) : attentif au prix, moins à la qualité.
3. L'argent **des autres** pour **moi** : attentif à la qualité, pas au prix.
4. L'argent **des autres** pour **les autres** : ni au prix, ni à la qualité — c'est, dit-il, la façon dont l'**État** dépense, d'où son inefficacité.

Friedman plaide donc pour un **État limité** (et propose des idées comme l'**impôt négatif** pour aider les plus pauvres sans lourde bureaucratie).

## L'essentiel à retenir
- Friedman (XXe s.), **école de Chicago**, **Nobel 1976**.
- **Monétarisme** : « l'inflation est toujours et partout un phénomène monétaire ».
- **Liberté économique et liberté politique** vont de pair (« Capitalisme et liberté »).
- **« Pas de repas gratuit »** : tout a un coût ; l'État dépense l'argent des autres pour les autres → **État limité**.$md$, 3)
) AS v(title, md, pos)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Économie'
ON CONFLICT (chapter_id, title) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. Un quiz par leçon (rattaché via lesson_id), seulement si la leçon n'en a
--    pas déjà un. Quiz gratuits (culture générale accessible à tous).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Culture générale', 'tous', 'Économie', true, l.id
FROM (VALUES
  ('15019999-0000-4000-8000-000000000001'::uuid, 'Adam Smith', 'Adam Smith — la main invisible'),
  ('15019999-0000-4000-8000-000000000002'::uuid, 'Frédéric Bastiat', 'Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas'),
  ('15019999-0000-4000-8000-000000000003'::uuid, 'Milton Friedman', 'Milton Friedman — monnaie et liberté')
) AS v(quiz_id, title, lesson)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Économie'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = v.lesson
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 5. Questions (10 par quiz), attachées au quiz de la leçon via la jointure.
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Adam Smith
  ('15010000-0000-4000-8000-000000000101'::uuid, 'Adam Smith — la main invisible',
   'Quel est l''ouvrage majeur d''Adam Smith (1776) ?', 'mcq',
   '["La Richesse des nations", "Le Capital", "Capitalisme et liberté", "La Loi"]', 0,
   '« Recherches sur la nature et les causes de la richesse des nations » (1776).', 1),
  ('15010000-0000-4000-8000-000000000102'::uuid, 'Adam Smith — la main invisible',
   'Que désigne la « main invisible » ?', 'mcq',
   '["Le marché qui transforme les intérêts individuels en bien commun", "L''État qui dirige l''économie", "La banque centrale", "Un impôt caché"]', 0,
   'En cherchant son intérêt, chacun sert sans le vouloir l''intérêt général.', 2),
  ('15010000-0000-4000-8000-000000000103'::uuid, 'Adam Smith — la main invisible',
   'Quel exemple illustre la division du travail chez Smith ?', 'mcq',
   '["La fabrique d''épingles", "La vitre cassée", "Les chandelles", "Le repas gratuit"]', 0,
   'Dix ouvriers spécialisés produisent des milliers d''épingles, contre quelques-unes chacun seul.', 3),
  ('15010000-0000-4000-8000-000000000104'::uuid, 'Adam Smith — la main invisible',
   'Selon Smith, pourquoi le boulanger nous vend-il du pain ?', 'mcq',
   '["Par intérêt personnel", "Par pure bienveillance", "Parce que l''État l''oblige", "Gratuitement"]', 0,
   '« Ce n''est pas de la bienveillance du boulanger… mais du soin qu''il apporte à ses intérêts. »', 4),
  ('15010000-0000-4000-8000-000000000105'::uuid, 'Adam Smith — la main invisible',
   'La division du travail permet surtout d''augmenter…', 'mcq',
   '["la productivité", "les impôts", "l''inflation", "le chômage"]', 0,
   'La spécialisation décuple la quantité produite : c''est le moteur de la richesse.', 5),
  ('15010000-0000-4000-8000-000000000106'::uuid, 'Adam Smith — la main invisible',
   'Adam Smith est considéré comme…', 'mcq',
   '["le père de l''économie moderne", "le père du communisme", "l''inventeur de la monnaie", "un roi d''Écosse"]', 0,
   'Son œuvre fonde l''économie politique comme science.', 6),
  ('15010000-0000-4000-8000-000000000107'::uuid, 'Adam Smith — la main invisible',
   'Quel autre livre de Smith porte sur la morale ?', 'mcq',
   '["La Théorie des sentiments moraux", "Le Contrat social", "L''Éthique à Nicomaque", "Le Prince"]', 0,
   'Smith y montre le rôle de la « sympathie » : il n''est pas un apôtre de l''égoïsme.', 7),
  ('15010000-0000-4000-8000-000000000108'::uuid, 'Adam Smith — la main invisible',
   'Pour Smith, la recherche de l''intérêt personnel peut servir l''intérêt général.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est le principe même de la main invisible.', 8),
  ('15010000-0000-4000-8000-000000000109'::uuid, 'Adam Smith — la main invisible',
   'À quel siècle a vécu Adam Smith ?', 'mcq',
   '["XVIIIe siècle", "XVIe siècle", "XXe siècle", "XIXe siècle"]', 0,
   'Adam Smith : 1723-1790, siècle des Lumières.', 9),
  ('15010000-0000-4000-8000-000000000110'::uuid, 'Adam Smith — la main invisible',
   'Quelle position Smith défend-il entre les nations ?', 'mcq',
   '["Le libre-échange", "Le protectionnisme", "L''autarcie", "La planification"]', 0,
   'Chaque pays gagne à se spécialiser et à échanger librement.', 10),

  -- Frédéric Bastiat
  ('15010000-0000-4000-8000-000000000201'::uuid, 'Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas',
   'Que montre le sophisme de la vitre cassée ?', 'mcq',
   '["La destruction n''enrichit pas (coûts cachés)", "Casser crée des emplois utiles", "Le vitrier s''enrichit donc tout le monde gagne", "Il faut casser pour relancer l''économie"]', 0,
   'On voit le vitrier payé, mais pas ce que le père aurait acheté sinon.', 1),
  ('15010000-0000-4000-8000-000000000202'::uuid, 'Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas',
   '« Ce qu''on voit et ce qu''on ne voit pas » invite à regarder…', 'mcq',
   '["les effets cachés et indirects", "seulement l''effet immédiat", "uniquement le court terme", "les intentions"]', 0,
   'Le bon économiste considère les conséquences invisibles, pas seulement visibles.', 2),
  ('15010000-0000-4000-8000-000000000203'::uuid, 'Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas',
   'La pétition des fabricants de chandelles est une satire du…', 'mcq',
   '["protectionnisme", "libre-échange", "salariat", "capitalisme"]', 0,
   'Demander d''« interdire le soleil » ridiculise la protection des producteurs.', 3),
  ('15010000-0000-4000-8000-000000000204'::uuid, 'Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas',
   'Bastiat était favorable au…', 'mcq',
   '["libre-échange", "protectionnisme", "monopole d''État", "rationnement"]', 0,
   'C''était un libéral et libre-échangiste convaincu.', 4),
  ('15010000-0000-4000-8000-000000000205'::uuid, 'Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas',
   'Selon « La Loi », quel est le rôle légitime de la loi ?', 'mcq',
   '["Protéger la liberté et la propriété", "Redistribuer toutes les richesses", "Fixer tous les prix", "Diriger la production"]', 0,
   'La loi doit protéger la personne, la liberté et la propriété.', 5),
  ('15010000-0000-4000-8000-000000000206'::uuid, 'Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas',
   'Complète : « L''État, c''est la grande fiction à travers laquelle tout le monde s''efforce de vivre… »', 'mcq',
   '["aux dépens de tout le monde", "en harmonie", "sans jamais travailler", "pour le roi"]', 0,
   'Célèbre formule de Bastiat sur la spoliation légale.', 6),
  ('15010000-0000-4000-8000-000000000207'::uuid, 'Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas',
   'Bastiat était de nationalité… et a vécu au…', 'mcq',
   '["française, XIXe siècle", "anglaise, XVIIIe siècle", "américaine, XXe siècle", "écossaise, XVIIe siècle"]', 0,
   'Frédéric Bastiat : 1801-1850, France.', 7),
  ('15010000-0000-4000-8000-000000000208'::uuid, 'Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas',
   'La « spoliation légale » désigne…', 'mcq',
   '["la loi qui prend aux uns pour donner aux autres", "le vol puni par la loi", "un impôt sur la fortune", "la contrebande"]', 0,
   'Quand la loi organise la prise sur autrui, elle pervertit la justice.', 8),
  ('15010000-0000-4000-8000-000000000209'::uuid, 'Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas',
   'Casser une vitre crée de la richesse pour la société.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : c''est le sophisme dénoncé par Bastiat. La richesse est détruite, pas créée.', 9),
  ('15010000-0000-4000-8000-000000000210'::uuid, 'Frédéric Bastiat — ce qu''on voit et ce qu''on ne voit pas',
   'Comment qualifie-t-on le style de Bastiat ?', 'mcq',
   '["pamphlétaire (textes courts et satiriques)", "poète romantique", "romancier réaliste", "auteur de tragédies"]', 0,
   'Ses pamphlets démontent les fausses évidences avec humour et clarté.', 10),

  -- Milton Friedman
  ('15010000-0000-4000-8000-000000000301'::uuid, 'Milton Friedman — monnaie et liberté',
   'Complète la thèse de Friedman : « L''inflation est toujours et partout un phénomène… »', 'mcq',
   '["monétaire", "politique", "naturel", "psychologique"]', 0,
   'Trop de monnaie créée par rapport aux biens → hausse des prix.', 1),
  ('15010000-0000-4000-8000-000000000302'::uuid, 'Milton Friedman — monnaie et liberté',
   'À quelle école de pensée Friedman est-il associé ?', 'mcq',
   '["l''école de Chicago", "l''école de Francfort", "l''école de Vienne classique", "les physiocrates"]', 0,
   'Milton Friedman est la grande figure de l''école de Chicago.', 2),
  ('15010000-0000-4000-8000-000000000303'::uuid, 'Milton Friedman — monnaie et liberté',
   'Que signifie « There is no such thing as a free lunch » ?', 'mcq',
   '["Tout a un coût", "Les repas sont gratuits", "L''État doit nourrir tout le monde", "Le marché offre des cadeaux"]', 0,
   'Une dépense « gratuite » est en réalité payée par quelqu''un (impôts, dette, inflation).', 3),
  ('15010000-0000-4000-8000-000000000304'::uuid, 'Milton Friedman — monnaie et liberté',
   'Selon Friedman, la liberté économique est une condition de…', 'mcq',
   '["la liberté politique", "l''inflation", "la pauvreté", "la bureaucratie"]', 0,
   'Thèse centrale de « Capitalisme et liberté » (1962).', 4),
  ('15010000-0000-4000-8000-000000000305'::uuid, 'Milton Friedman — monnaie et liberté',
   'Quelle distinction Friedman a-t-il reçue en 1976 ?', 'mcq',
   '["le prix Nobel d''économie", "le prix Nobel de la paix", "la médaille Fields", "aucun"]', 0,
   'Prix Nobel d''économie 1976.', 5),
  ('15010000-0000-4000-8000-000000000306'::uuid, 'Milton Friedman — monnaie et liberté',
   'Le monétarisme insiste sur le rôle de…', 'mcq',
   '["la masse monétaire", "la mode", "la météo", "la démographie seule"]', 0,
   'Contrôler la quantité de monnaie pour maîtriser l''inflation.', 6),
  ('15010000-0000-4000-8000-000000000307'::uuid, 'Milton Friedman — monnaie et liberté',
   'Quel livre majeur a écrit Friedman ?', 'mcq',
   '["Capitalisme et liberté", "La Richesse des nations", "Le Capital", "La Loi"]', 0,
   '« Capitalisme et liberté » (1962), puis « La liberté du choix ».', 7),
  ('15010000-0000-4000-8000-000000000308'::uuid, 'Milton Friedman — monnaie et liberté',
   'Dans les « quatre façons de dépenser l''argent », laquelle est la moins efficace ?', 'mcq',
   '["l''argent des autres pour les autres (l''État)", "mon argent pour moi", "mon argent pour les autres", "l''argent des autres pour moi"]', 0,
   'On ne fait alors attention ni au prix ni à la qualité — d''où l''inefficacité, selon Friedman.', 8),
  ('15010000-0000-4000-8000-000000000309'::uuid, 'Milton Friedman — monnaie et liberté',
   'Friedman plaide pour une très forte intervention de l''État dans l''économie.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : il défend au contraire un État limité et la liberté des marchés.', 9),
  ('15010000-0000-4000-8000-000000000310'::uuid, 'Milton Friedman — monnaie et liberté',
   'Quelle idée Friedman a-t-il proposée pour aider les plus pauvres sans lourde bureaucratie ?', 'mcq',
   '["l''impôt négatif", "la TVA sociale", "le salaire maximum", "la nationalisation"]', 0,
   'L''impôt négatif (un revenu versé sous un certain seuil).', 10)
) AS d(id, lesson, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'culture-generale'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Économie'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = d.lesson
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
