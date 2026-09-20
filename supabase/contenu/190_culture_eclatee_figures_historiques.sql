-- =============================================================================
-- Studuel — Migration 190 : ÉCLATEMENT de « Culture générale » en matières
--                           + nouvelle matière « Figures historiques françaises »
--
-- Avant : un seul dossier « Culture générale » (slug 'culture-generale') dont
-- les thèmes (Économie, Finances personnelles, Fiscalité, Entrepreneuriat)
-- étaient des CHAPITRES. Après : chaque thème devient une MATIÈRE à part
-- entière (catégorie 'culture', hors-niveau 'tous') avec son propre bouton et
-- sa propre illustration sur l'accueil Réviser. Les chapitres existants sont
-- RE-PARENTÉS (mêmes ids → la progression/maîtrise des élèves est conservée),
-- puis le dossier « Culture générale », vidé, est supprimé.
--
-- S'ajoute une 5e matière : « Figures historiques françaises » (Jeanne d'Arc,
-- Louis XIV, Napoléon, Victor Hugo, de Gaulle — cours + quiz de 10 questions).
--
-- PRÉREQUIS : 150→154 (dossier Culture générale et ses 4 thèmes).
-- Idempotent (ON CONFLICT / gardes NOT EXISTS ; le re-parentage ne matche plus
-- rien une fois exécuté). À exécuter à la main dans :
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Les 5 matières « culture » (toutes classes, chapitres au niveau 'tous').
-- -----------------------------------------------------------------------------
INSERT INTO public.subjects (slug, name, icon, color, category, levels, fixed_level)
VALUES
  ('economie',              'Économie',                       '📈', 'teal',   'culture', '{6e,5e,4e,3e,2de,1re,Tle}', 'tous'),
  ('finances-personnelles', 'Finances personnelles',          '🐷', 'yellow', 'culture', '{6e,5e,4e,3e,2de,1re,Tle}', 'tous'),
  ('fiscalite',             'Fiscalité',                      '🧾', 'slate',  'culture', '{6e,5e,4e,3e,2de,1re,Tle}', 'tous'),
  ('entrepreneuriat',       'Entrepreneuriat',                '🚀', 'orange', 'culture', '{6e,5e,4e,3e,2de,1re,Tle}', 'tous'),
  ('figures-historiques',   'Figures historiques françaises', '🏛️', 'red',    'culture', '{6e,5e,4e,3e,2de,1re,Tle}', 'tous')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color,
      category = 'culture', levels = EXCLUDED.levels, fixed_level = 'tous';

-- -----------------------------------------------------------------------------
-- 2. Re-parentage des chapitres-thèmes existants vers leur nouvelle matière.
--    Les ids de chapitres ne changent PAS : leçons, quiz et progression des
--    élèves suivent sans aucune retouche.
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
SET subject_id = ns.id, position = 1
FROM public.subjects os,
     public.subjects ns,
     (VALUES
       ('Économie',              'economie'),
       ('Finances personnelles', 'finances-personnelles'),
       ('Fiscalité',             'fiscalite'),
       ('Entrepreneuriat',       'entrepreneuriat')
     ) AS m(title, slug)
WHERE os.slug = 'culture-generale'
  AND ns.slug = m.slug
  AND c.subject_id = os.id
  AND c.level = 'tous'
  AND c.title = m.title
  -- Garde anti-doublon si la migration est rejouée sur un état partiel.
  AND NOT EXISTS (
    SELECT 1 FROM public.chapters c2
    WHERE c2.subject_id = ns.id AND c2.level = 'tous' AND c2.title = m.title
  );

-- -----------------------------------------------------------------------------
-- 3. Libellé `subject` des quiz : « Culture générale » → le nom de la nouvelle
--    matière (le rattachement fonctionnel passe par lesson_id, ceci est le
--    libellé affiché).
-- -----------------------------------------------------------------------------
UPDATE public.quizzes q
SET subject = ns.name
FROM public.lessons l
JOIN public.chapters c ON c.id = l.chapter_id
JOIN public.subjects ns ON ns.id = c.subject_id
WHERE q.lesson_id = l.id
  AND ns.category = 'culture'
  AND q.subject = 'Culture générale';

-- -----------------------------------------------------------------------------
-- 4. Suppression du dossier « Culture générale », uniquement une fois vidé de
--    tous ses chapitres (sécurité : ne supprime jamais du contenu).
-- -----------------------------------------------------------------------------
DELETE FROM public.subjects s
WHERE s.slug = 'culture-generale'
  AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.subject_id = s.id);

-- -----------------------------------------------------------------------------
-- 5. « Figures historiques françaises » — chapitre unique au niveau 'tous'.
-- -----------------------------------------------------------------------------
INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, 'tous', 'Figures historiques', 1
FROM public.subjects s WHERE s.slug = 'figures-historiques'
ON CONFLICT (subject_id, level, title) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 6. Leçons : une grande figure par leçon (cours dans lessons.content).
-- -----------------------------------------------------------------------------
INSERT INTO public.lessons (chapter_id, title, content, position)
SELECT c.id, v.title, v.md, v.pos
FROM (VALUES
  ('Jeanne d''Arc — la libératrice d''Orléans', $md$# Jeanne d'Arc — la libératrice d'Orléans

## Qui est-elle ?
**Jeanne d'Arc** (vers 1412-1431) est une jeune paysanne de **Domrémy**, en Lorraine. Vers 13 ans, elle affirme entendre des **voix** célestes lui confiant une mission : **chasser les Anglais** du royaume et faire **sacrer le roi**. En moins de deux ans, cette adolescente change le cours de la **guerre de Cent Ans**.

## 1. Une France au bord du gouffre
La **guerre de Cent Ans** (1337-1453) oppose les royaumes de France et d'Angleterre. Après le désastre d'**Azincourt** (1415), le **traité de Troyes** (1420) déshérite le dauphin **Charles** : la couronne de France est promise au roi d'Angleterre. Une grande partie du nord du royaume, dont Paris, est occupée.

## 2. Orléans et le sacre (1429)
En 1429, Jeanne convainc le dauphin à **Chinon** de lui confier une armée. Elle fait lever le siège d'**Orléans** (mai 1429) — un retournement immense pour le moral du royaume — puis conduit Charles se faire **sacrer à Reims** le 17 juillet 1429. Devenu **Charles VII**, roi sacré, il retrouve sa **légitimité** face au roi d'Angleterre.

## 3. Le procès et le bûcher
Capturée à **Compiègne** (1430) par les Bourguignons, alliés des Anglais, Jeanne leur est vendue. Jugée à **Rouen** par un tribunal d'Église acquis aux Anglais, elle est condamnée pour **hérésie** et **brûlée vive le 30 mai 1431**, à environ 19 ans. Un second procès la **réhabilite** en 1456 ; l'Église la proclame **sainte** en 1920.

## 4. Un symbole national
Jeanne d'Arc incarne le **courage**, la **foi en sa mission** et l'**unité du royaume** face à l'occupation. Elle reste l'une des figures les plus célèbres de l'histoire de France — une héroïne populaire dont se réclament, depuis, des mémoires très diverses.

## L'essentiel à retenir
- Paysanne de **Domrémy**, elle dit obéir à des **voix** : bouter les Anglais hors de France.
- **1429** : levée du siège d'**Orléans**, puis **sacre de Charles VII à Reims**.
- Capturée, vendue aux Anglais, jugée pour **hérésie**, **brûlée à Rouen le 30 mai 1431**.
- **Réhabilitée en 1456**, canonisée en **1920** — symbole du courage et de l'unité nationale.$md$, 1),

  ('Louis XIV — le Roi-Soleil', $md$# Louis XIV — le Roi-Soleil

## Qui est-il ?
**Louis XIV** (1638-1715) devient roi à **4 ans** et règne **72 ans** — le règne le plus long de l'histoire de France. Il incarne la **monarchie absolue de droit divin** : un roi qui tient son pouvoir de Dieu et n'a de comptes à rendre à personne. Son emblème : le **Soleil**, autour duquel tout gravite.

## 1. Le pouvoir personnel (1661)
À la mort du cardinal **Mazarin** en **1661**, Louis XIV surprend tout le monde : il gouvernera **sans Premier ministre**. Marqué enfant par la **Fronde** (révolte des nobles), il décide que plus personne ne fera trembler le trône. Tout remonte au roi : c'est la **monarchie absolue**.

## 2. Versailles, une machine à domestiquer la noblesse
Louis XIV transforme un pavillon de chasse en palais démesuré : **Versailles**, où la cour s'installe en **1682**. Les grands nobles y vivent près du roi, occupés par l'**étiquette** (qui tient le bougeoir du roi ?) et les faveurs. Loin de leurs terres, ils ne complotent plus : la cour est un **instrument de pouvoir**.

## 3. Colbert et l'économie
Son ministre **Colbert** développe les **manufactures royales** (Gobelins, glaces de Saint-Gobain), soutient le commerce et la marine : c'est le **colbertisme** — l'État intervient pour enrichir le royaume.

## 4. Ombres du règne
- Des **guerres presque permanentes**, ruineuses pour le royaume.
- La **révocation de l'édit de Nantes** (**1685**) : le protestantisme devient interdit, des centaines de milliers de protestants fuient la France.
- Famines et impôts écrasants pour les paysans.

## 5. Un siècle de rayonnement
Le règne est aussi le **Grand Siècle** des arts : **Molière**, **Racine**, **La Fontaine**, **Lully**. Le français et le goût « à la française » rayonnent dans toute l'Europe.

## L'essentiel à retenir
- Règne de **72 ans** ; pouvoir personnel à partir de **1661**, sans Premier ministre.
- **Monarchie absolue de droit divin** ; emblème du **Soleil**.
- **Versailles** (cour en 1682) : la noblesse domestiquée par l'étiquette.
- **Colbert** : manufactures et commerce ; **1685** : révocation de l'édit de Nantes.
- Grand Siècle des arts : Molière, Racine, Lully.$md$, 2),

  ('Napoléon Bonaparte — de la Révolution à l''Empire', $md$# Napoléon Bonaparte — de la Révolution à l'Empire

## Qui est-il ?
**Napoléon Bonaparte** (1769-1821), né à **Ajaccio** (Corse), est un général devenu **empereur des Français**. Héritier de la Révolution pour les uns, tyran pour les autres, il a durablement transformé la France — beaucoup de ses institutions existent encore.

## 1. Le général de la Révolution
Jeune officier d'artillerie, il se distingue pendant la Révolution, puis brille à la tête de l'**armée d'Italie** (1796-1797) et part en **Égypte**. Auréolé de gloire, il renverse le régime par le **coup d'État du 18 Brumaire** (9 novembre **1799**) et devient **Premier consul**.

## 2. Le bâtisseur d'institutions
Entre 1800 et 1804, il réorganise la France :
- **Code civil** (**1804**) : un même droit écrit pour tous les Français — toujours en vigueur (modifié).
- **Préfets** dans chaque département, **Banque de France**, **franc germinal**.
- **Lycées** et **baccalauréat**, **Légion d'honneur**.

## 3. L'Empire et les victoires (1804-1812)
Le **2 décembre 1804**, il se couronne **empereur** à Notre-Dame. Chef de guerre exceptionnel, il bat les grandes monarchies européennes — victoire éclatante d'**Austerlitz** (2 décembre **1805**) — et domine une grande partie de l'Europe.

## 4. La chute (1812-1815)
La désastreuse **campagne de Russie** (**1812**) détruit la Grande Armée. Vaincu, Napoléon abdique en **1814** et est exilé à l'**île d'Elbe**. Il revient pour les **Cent-Jours**, mais la défaite de **Waterloo** (18 juin **1815**) est définitive : il meurt en exil à **Sainte-Hélène** en 1821.

## L'essentiel à retenir
- Général corse de la Révolution ; **18 Brumaire 1799** : il prend le pouvoir.
- **Code civil (1804)**, préfets, lycées, bac, Banque de France, Légion d'honneur.
- **Empereur le 2 décembre 1804** ; **Austerlitz** (1805).
- Chute : **Russie 1812** → abdication 1814 → **Waterloo 1815** → Sainte-Hélène.$md$, 3),

  ('Victor Hugo — la voix d''un siècle', $md$# Victor Hugo — la voix d'un siècle

## Qui est-il ?
**Victor Hugo** (1802-1885) est le géant des lettres françaises du XIXe siècle : poète, dramaturge, romancier — et homme politique engagé. Sa vie épouse presque tout le siècle, de Napoléon Ier à la IIIe République.

## 1. Le chef de file du romantisme
Très jeune, Hugo s'impose comme le chef du **romantisme**, qui libère la littérature des règles classiques. La première de sa pièce **« Hernani »** (**1830**) déclenche une véritable **bataille** entre anciens et modernes. Suivent d'immenses romans : **« Notre-Dame de Paris »** (1831) et, plus tard, **« Les Misérables »** (**1862**), fresque des pauvres et des injustices, avec Jean Valjean, Cosette et Gavroche.

## 2. L'écrivain engagé
Hugo met sa plume au service de ses combats :
- contre la **peine de mort** (« Le Dernier Jour d'un condamné », 1829) ;
- contre le **travail des enfants** et la **misère** (« Melancholia », discours à l'Assemblée) ;
- pour l'**école** et la **liberté de la presse**.

## 3. L'exil face à « Napoléon le Petit »
Député, Hugo s'oppose au coup d'État de **Louis-Napoléon Bonaparte** (2 décembre 1851). Proscrit, il s'exile **19 ans**, notamment à **Guernesey**. De là, il mitraille l'Empire : « **Napoléon le Petit** », **« Les Châtiments »**. Il refuse toute amnistie : « Quand la liberté rentrera, je rentrerai. » Il rentre en **1870**, à la chute de l'Empire, accueilli en héros.

## 4. La gloire nationale
Sénateur sous la IIIe République, il meurt en **1885**. La France lui offre des **funérailles nationales** : environ deux millions de personnes suivent le cercueil jusqu'au **Panthéon**.

## L'essentiel à retenir
- Chef de file du **romantisme** : « Hernani » (1830), « Notre-Dame de Paris » (1831), **« Les Misérables » (1862)**.
- Combats : contre la **peine de mort**, la misère, pour l'école et la liberté.
- **19 ans d'exil** (Guernesey) contre Napoléon III ; retour triomphal en 1870.
- Mort en **1885** : funérailles nationales, entre au **Panthéon**.$md$, 4),

  ('Charles de Gaulle — l''homme du 18 juin', $md$# Charles de Gaulle — l'homme du 18 juin

## Qui est-il ?
**Charles de Gaulle** (1890-1970), militaire de carrière, refuse la défaite de 1940 et incarne la **France libre**. Rappelé au pouvoir en 1958, il fonde la **Ve République** — le régime dans lequel la France vit encore aujourd'hui.

## 1. L'appel du 18 juin 1940
En juin 1940, la France est écrasée par l'Allemagne nazie et le maréchal Pétain demande l'armistice. Depuis **Londres**, sur les ondes de la **BBC**, le général de Gaulle lance le **18 juin 1940** un appel à **continuer le combat** : « La France a perdu une bataille, mais la France n'a pas perdu la guerre ! » C'est l'acte de naissance de la **France libre** et de la **Résistance** extérieure.

## 2. La Libération et les grandes réformes
À la Libération, de Gaulle dirige le **Gouvernement provisoire** (1944-1946). Des réformes majeures sont lancées : **droit de vote des femmes** (voté en 1944, premier vote en 1945), **Sécurité sociale** (1945), nationalisations. En désaccord avec le retour des partis, il démissionne en 1946.

## 3. 1958 : la Ve République
Rappelé en **1958** en pleine crise de la **guerre d'Algérie**, il fait adopter une nouvelle constitution : la **Ve République**, au **pouvoir exécutif fort**. Il en devient le premier président et fait approuver en **1962**, par référendum, l'**élection du président au suffrage universel direct**. La même année, les **accords d'Évian** mettent fin à la guerre : l'**Algérie devient indépendante**.

## 4. La politique de grandeur, puis le départ
De Gaulle veut une France **indépendante** : force nucléaire, retrait du commandement intégré de l'**OTAN** (1966), politique étrangère autonome. Contesté par la jeunesse en **Mai 68**, il quitte le pouvoir en **1969** après l'échec d'un référendum, et meurt en **1970** à Colombey-les-Deux-Églises.

## L'essentiel à retenir
- **18 juin 1940** : appel de Londres (BBC) → **France libre**.
- Libération : **vote des femmes (1944)**, **Sécurité sociale (1945)**.
- **1958** : fondation de la **Ve République** ; **1962** : président élu au suffrage universel direct, indépendance de l'**Algérie**.
- Mai 68, démission en **1969**, mort en **1970**.$md$, 5)
) AS v(title, md, pos)
JOIN public.subjects s ON s.slug = 'figures-historiques'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Figures historiques'
ON CONFLICT (chapter_id, title) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 7. Un quiz par leçon (rattaché via lesson_id), seulement si la leçon n'en a
--    pas déjà un. Quiz gratuits (culture accessible à tous).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Figures historiques françaises', 'tous', 'Figures historiques', true, l.id
FROM (VALUES
  ('19019999-0000-4000-8000-000000000001'::uuid, 'Jeanne d''Arc', 'Jeanne d''Arc — la libératrice d''Orléans'),
  ('19019999-0000-4000-8000-000000000002'::uuid, 'Louis XIV', 'Louis XIV — le Roi-Soleil'),
  ('19019999-0000-4000-8000-000000000003'::uuid, 'Napoléon Bonaparte', 'Napoléon Bonaparte — de la Révolution à l''Empire'),
  ('19019999-0000-4000-8000-000000000004'::uuid, 'Victor Hugo', 'Victor Hugo — la voix d''un siècle'),
  ('19019999-0000-4000-8000-000000000005'::uuid, 'Charles de Gaulle', 'Charles de Gaulle — l''homme du 18 juin')
) AS v(quiz_id, title, lesson)
JOIN public.subjects s ON s.slug = 'figures-historiques'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Figures historiques'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = v.lesson
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 8. Questions (10 par quiz), attachées au quiz de la leçon via la jointure.
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Jeanne d'Arc
  ('19010000-0000-4000-8000-000000000101'::uuid, 'Jeanne d''Arc — la libératrice d''Orléans',
   'De quel village Jeanne d''Arc est-elle originaire ?', 'mcq',
   '["Domrémy", "Orléans", "Rouen", "Reims"]', 0,
   'Jeanne naît vers 1412 à Domrémy, en Lorraine.', 1),
  ('19010000-0000-4000-8000-000000000102'::uuid, 'Jeanne d''Arc — la libératrice d''Orléans',
   'Pendant quelle guerre Jeanne d''Arc agit-elle ?', 'mcq',
   '["La guerre de Cent Ans", "Les guerres de Religion", "La guerre de Trente Ans", "La Première Guerre mondiale"]', 0,
   'La guerre de Cent Ans (1337-1453) oppose les royaumes de France et d''Angleterre.', 2),
  ('19010000-0000-4000-8000-000000000103'::uuid, 'Jeanne d''Arc — la libératrice d''Orléans',
   'Quel exploit militaire rend Jeanne célèbre en mai 1429 ?', 'mcq',
   '["La levée du siège d''Orléans", "La prise de Londres", "La bataille d''Azincourt", "La prise de Bordeaux"]', 0,
   'Elle fait lever le siège d''Orléans, retournement décisif de la guerre.', 3),
  ('19010000-0000-4000-8000-000000000104'::uuid, 'Jeanne d''Arc — la libératrice d''Orléans',
   'Où Jeanne conduit-elle le dauphin pour être sacré roi ?', 'mcq',
   '["À Reims", "À Paris", "À Versailles", "À Chinon"]', 0,
   'Charles VII est sacré à Reims le 17 juillet 1429 — le sacre lui rend sa légitimité.', 4),
  ('19010000-0000-4000-8000-000000000105'::uuid, 'Jeanne d''Arc — la libératrice d''Orléans',
   'Quel traité avait promis la couronne de France au roi d''Angleterre ?', 'mcq',
   '["Le traité de Troyes (1420)", "Le traité de Verdun", "Le traité de Versailles", "L''édit de Nantes"]', 0,
   'Le traité de Troyes (1420) déshéritait le dauphin Charles.', 5),
  ('19010000-0000-4000-8000-000000000106'::uuid, 'Jeanne d''Arc — la libératrice d''Orléans',
   'Par qui Jeanne est-elle capturée à Compiègne en 1430 ?', 'mcq',
   '["Par les Bourguignons", "Par les Espagnols", "Par les troupes de Charles VII", "Par les Prussiens"]', 0,
   'Les Bourguignons, alliés des Anglais, la capturent puis la leur vendent.', 6),
  ('19010000-0000-4000-8000-000000000107'::uuid, 'Jeanne d''Arc — la libératrice d''Orléans',
   'Pour quel motif Jeanne est-elle condamnée à Rouen ?', 'mcq',
   '["Pour hérésie", "Pour vol", "Pour trahison militaire", "Pour espionnage"]', 0,
   'Un tribunal d''Église acquis aux Anglais la condamne pour hérésie.', 7),
  ('19010000-0000-4000-8000-000000000108'::uuid, 'Jeanne d''Arc — la libératrice d''Orléans',
   'Jeanne d''Arc est brûlée vive à Rouen le 30 mai 1431.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : elle meurt sur le bûcher à environ 19 ans.', 8),
  ('19010000-0000-4000-8000-000000000109'::uuid, 'Jeanne d''Arc — la libératrice d''Orléans',
   'Que se passe-t-il en 1456, vingt-cinq ans après sa mort ?', 'mcq',
   '["Un procès la réhabilite", "Elle est canonisée", "La guerre de Cent Ans commence", "Orléans est reprise par les Anglais"]', 0,
   'Le procès en réhabilitation de 1456 annule sa condamnation ; la canonisation viendra en 1920.', 9),
  ('19010000-0000-4000-8000-000000000110'::uuid, 'Jeanne d''Arc — la libératrice d''Orléans',
   'Jeanne d''Arc a été proclamée sainte dès sa mort en 1431.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : l''Église ne la canonise qu''en 1920, près de cinq siècles plus tard.', 10),

  -- Louis XIV
  ('19010000-0000-4000-8000-000000000201'::uuid, 'Louis XIV — le Roi-Soleil',
   'Combien de temps a duré le règne de Louis XIV ?', 'mcq',
   '["72 ans", "20 ans", "45 ans", "10 ans"]', 0,
   'De 1643 à 1715 : le règne le plus long de l''histoire de France.', 1),
  ('19010000-0000-4000-8000-000000000202'::uuid, 'Louis XIV — le Roi-Soleil',
   'Que décide Louis XIV à la mort de Mazarin en 1661 ?', 'mcq',
   '["De gouverner sans Premier ministre", "D''abdiquer", "De partager le pouvoir avec le Parlement", "De quitter la France"]', 0,
   'C''est le début du pouvoir personnel : tout remonte désormais au roi.', 2),
  ('19010000-0000-4000-8000-000000000203'::uuid, 'Louis XIV — le Roi-Soleil',
   'Comment appelle-t-on le régime incarné par Louis XIV ?', 'mcq',
   '["La monarchie absolue de droit divin", "La monarchie parlementaire", "La république", "L''empire"]', 0,
   'Le roi tient son pouvoir de Dieu et n''a de comptes à rendre à personne.', 3),
  ('19010000-0000-4000-8000-000000000204'::uuid, 'Louis XIV — le Roi-Soleil',
   'Quel est l''emblème choisi par Louis XIV ?', 'mcq',
   '["Le Soleil", "L''aigle", "La fleur de lys seule", "Le lion"]', 0,
   'Le Roi-Soleil : tout gravite autour de lui, comme les planètes autour du Soleil.', 4),
  ('19010000-0000-4000-8000-000000000205'::uuid, 'Louis XIV — le Roi-Soleil',
   'À quoi sert la cour de Versailles pour Louis XIV ?', 'mcq',
   '["À surveiller et domestiquer la noblesse", "À loger les paysans", "À abriter le Parlement", "À entraîner l''armée"]', 0,
   'Occupés par l''étiquette et les faveurs, loin de leurs terres, les nobles ne complotent plus.', 5),
  ('19010000-0000-4000-8000-000000000206'::uuid, 'Louis XIV — le Roi-Soleil',
   'Quel ministre développe manufactures et commerce sous Louis XIV ?', 'mcq',
   '["Colbert", "Richelieu", "Mazarin", "Sully"]', 0,
   'Colbert : manufactures royales, marine, commerce — le « colbertisme ».', 6),
  ('19010000-0000-4000-8000-000000000207'::uuid, 'Louis XIV — le Roi-Soleil',
   'Que décide la révocation de l''édit de Nantes en 1685 ?', 'mcq',
   '["L''interdiction du protestantisme en France", "La liberté de culte pour tous", "La paix avec l''Angleterre", "La création des lycées"]', 0,
   'Le culte protestant est interdit : des centaines de milliers de protestants fuient le royaume.', 7),
  ('19010000-0000-4000-8000-000000000208'::uuid, 'Louis XIV — le Roi-Soleil',
   'Louis XIV a gouverné avec un Premier ministre pendant tout son règne.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : après Mazarin (1661), il gouverne seul, sans Premier ministre.', 8),
  ('19010000-0000-4000-8000-000000000209'::uuid, 'Louis XIV — le Roi-Soleil',
   'Lequel de ces artistes appartient au « Grand Siècle » de Louis XIV ?', 'mcq',
   '["Molière", "Victor Hugo", "Claude Monet", "Émile Zola"]', 0,
   'Molière, Racine, La Fontaine, Lully : les arts rayonnent sous Louis XIV.', 9),
  ('19010000-0000-4000-8000-000000000210'::uuid, 'Louis XIV — le Roi-Soleil',
   'En quelle année la cour s''installe-t-elle définitivement à Versailles ?', 'mcq',
   '["1682", "1661", "1715", "1789"]', 0,
   'La cour et le gouvernement s''installent à Versailles en 1682.', 10),

  -- Napoléon Bonaparte
  ('19010000-0000-4000-8000-000000000301'::uuid, 'Napoléon Bonaparte — de la Révolution à l''Empire',
   'Où Napoléon Bonaparte est-il né en 1769 ?', 'mcq',
   '["À Ajaccio, en Corse", "À Paris", "À Marseille", "À Nice"]', 0,
   'Napoléon naît à Ajaccio, un an après le rattachement de la Corse à la France.', 1),
  ('19010000-0000-4000-8000-000000000302'::uuid, 'Napoléon Bonaparte — de la Révolution à l''Empire',
   'Comment Napoléon prend-il le pouvoir en 1799 ?', 'mcq',
   '["Par le coup d''État du 18 Brumaire", "Par une élection", "Par héritage royal", "Par un référendum"]', 0,
   'Le 18 Brumaire an VIII (9 novembre 1799), il renverse le Directoire et devient Premier consul.', 2),
  ('19010000-0000-4000-8000-000000000303'::uuid, 'Napoléon Bonaparte — de la Révolution à l''Empire',
   'Quel grand texte de 1804 unifie le droit pour tous les Français ?', 'mcq',
   '["Le Code civil", "La Déclaration de 1789", "La Constitution de 1958", "L''édit de Nantes"]', 0,
   'Le Code civil de 1804, toujours en vigueur (modifié), est l''œuvre la plus durable de Napoléon.', 3),
  ('19010000-0000-4000-8000-000000000304'::uuid, 'Napoléon Bonaparte — de la Révolution à l''Empire',
   'Que se passe-t-il le 2 décembre 1804 à Notre-Dame de Paris ?', 'mcq',
   '["Napoléon se couronne empereur", "Napoléon est battu", "Napoléon abdique", "Napoléon devient consul"]', 0,
   'Il se couronne lui-même empereur des Français, devant le pape.', 4),
  ('19010000-0000-4000-8000-000000000305'::uuid, 'Napoléon Bonaparte — de la Révolution à l''Empire',
   'Quelle victoire de 1805 est considérée comme son chef-d''œuvre militaire ?', 'mcq',
   '["Austerlitz", "Waterloo", "Verdun", "Azincourt"]', 0,
   'Austerlitz (2 décembre 1805), la « bataille des Trois Empereurs ».', 5),
  ('19010000-0000-4000-8000-000000000306'::uuid, 'Napoléon Bonaparte — de la Révolution à l''Empire',
   'Laquelle de ces institutions n''a PAS été créée par Napoléon ?', 'mcq',
   '["La Sécurité sociale", "Les lycées", "La Banque de France", "La Légion d''honneur"]', 0,
   'La Sécurité sociale date de 1945. Lycées, bac, préfets, Banque de France, Légion d''honneur : c''est lui.', 6),
  ('19010000-0000-4000-8000-000000000307'::uuid, 'Napoléon Bonaparte — de la Révolution à l''Empire',
   'Quelle campagne militaire de 1812 précipite sa chute ?', 'mcq',
   '["La campagne de Russie", "La campagne d''Égypte", "La campagne d''Italie", "La campagne d''Espagne"]', 0,
   'La Grande Armée est détruite par l''hiver et la retraite de Russie.', 7),
  ('19010000-0000-4000-8000-000000000308'::uuid, 'Napoléon Bonaparte — de la Révolution à l''Empire',
   'Quelle est la défaite définitive de Napoléon, le 18 juin 1815 ?', 'mcq',
   '["Waterloo", "Austerlitz", "Iéna", "Trafalgar"]', 0,
   'Après les Cent-Jours, Waterloo met fin à l''aventure impériale.', 8),
  ('19010000-0000-4000-8000-000000000309'::uuid, 'Napoléon Bonaparte — de la Révolution à l''Empire',
   'Napoléon meurt en exil à Sainte-Hélène en 1821.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : exilé sur cette île de l''Atlantique sud après Waterloo, il y meurt en 1821.', 9),
  ('19010000-0000-4000-8000-000000000310'::uuid, 'Napoléon Bonaparte — de la Révolution à l''Empire',
   'Le baccalauréat a été créé sous Napoléon.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le bac naît en 1808, avec les lycées créés en 1802.', 10),

  -- Victor Hugo
  ('19010000-0000-4000-8000-000000000401'::uuid, 'Victor Hugo — la voix d''un siècle',
   'De quel courant littéraire Victor Hugo est-il le chef de file ?', 'mcq',
   '["Le romantisme", "Le classicisme", "Le naturalisme", "Le surréalisme"]', 0,
   'Hugo libère la littérature des règles classiques : c''est le romantisme.', 1),
  ('19010000-0000-4000-8000-000000000402'::uuid, 'Victor Hugo — la voix d''un siècle',
   'Quelle pièce de 1830 déclenche une « bataille » entre anciens et modernes ?', 'mcq',
   '["Hernani", "Le Cid", "Cyrano de Bergerac", "Tartuffe"]', 0,
   'La première d''« Hernani » (1830) oppose partisans et adversaires du romantisme.', 2),
  ('19010000-0000-4000-8000-000000000403'::uuid, 'Victor Hugo — la voix d''un siècle',
   'Quel roman de 1862 raconte l''histoire de Jean Valjean et Cosette ?', 'mcq',
   '["Les Misérables", "Notre-Dame de Paris", "Germinal", "Le Rouge et le Noir"]', 0,
   '« Les Misérables » (1862), immense fresque des pauvres et des injustices.', 3),
  ('19010000-0000-4000-8000-000000000404'::uuid, 'Victor Hugo — la voix d''un siècle',
   'Contre quoi Hugo se bat-il dans « Le Dernier Jour d''un condamné » ?', 'mcq',
   '["La peine de mort", "Le travail du dimanche", "La liberté de la presse", "L''école obligatoire"]', 0,
   'Dès 1829, Hugo milite pour l''abolition de la peine de mort.', 4),
  ('19010000-0000-4000-8000-000000000405'::uuid, 'Victor Hugo — la voix d''un siècle',
   'Pourquoi Hugo s''exile-t-il pendant 19 ans ?', 'mcq',
   '["Il s''oppose au coup d''État de Louis-Napoléon Bonaparte", "Il fuit ses créanciers", "Il est condamné pour hérésie", "Il part enseigner à Londres"]', 0,
   'Opposant au coup d''État du 2 décembre 1851, il est proscrit et s''exile, notamment à Guernesey.', 5),
  ('19010000-0000-4000-8000-000000000406'::uuid, 'Victor Hugo — la voix d''un siècle',
   'Quel surnom moqueur Hugo donne-t-il à Napoléon III ?', 'mcq',
   '["Napoléon le Petit", "Le Roi-Soleil", "L''Aiglon", "Le Tigre"]', 0,
   'Depuis l''exil, il publie « Napoléon le Petit » et « Les Châtiments » contre l''Empire.', 6),
  ('19010000-0000-4000-8000-000000000407'::uuid, 'Victor Hugo — la voix d''un siècle',
   'Quand Hugo rentre-t-il d''exil, accueilli en héros ?', 'mcq',
   '["En 1870, à la chute du Second Empire", "En 1830", "En 1851", "En 1885"]', 0,
   '« Quand la liberté rentrera, je rentrerai » : il rentre à la chute de l''Empire, en 1870.', 7),
  ('19010000-0000-4000-8000-000000000408'::uuid, 'Victor Hugo — la voix d''un siècle',
   'Où repose Victor Hugo depuis ses funérailles nationales de 1885 ?', 'mcq',
   '["Au Panthéon", "À Notre-Dame", "Aux Invalides", "À Guernesey"]', 0,
   'Environ deux millions de personnes suivent le cortège jusqu''au Panthéon.', 8),
  ('19010000-0000-4000-8000-000000000409'::uuid, 'Victor Hugo — la voix d''un siècle',
   'Victor Hugo a accepté l''amnistie de Napoléon III pour rentrer plus tôt en France.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : il refuse toute amnistie tant que l''Empire est en place.', 9),
  ('19010000-0000-4000-8000-000000000410'::uuid, 'Victor Hugo — la voix d''un siècle',
   '« Notre-Dame de Paris » (1831) est un roman de Victor Hugo.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le roman de Quasimodo et Esmeralda popularise la cathédrale.', 10),

  -- Charles de Gaulle
  ('19010000-0000-4000-8000-000000000501'::uuid, 'Charles de Gaulle — l''homme du 18 juin',
   'Que fait de Gaulle le 18 juin 1940 ?', 'mcq',
   '["Il lance depuis Londres un appel à continuer le combat", "Il signe l''armistice", "Il devient président", "Il libère Paris"]', 0,
   'Sur les ondes de la BBC, l''appel du 18 juin fonde la France libre.', 1),
  ('19010000-0000-4000-8000-000000000502'::uuid, 'Charles de Gaulle — l''homme du 18 juin',
   'Depuis quelle radio l''appel du 18 juin est-il lancé ?', 'mcq',
   '["La BBC, à Londres", "Radio Paris", "Radio Vichy", "Radio Berlin"]', 0,
   'Réfugié à Londres, de Gaulle parle sur la radio britannique, la BBC.', 2),
  ('19010000-0000-4000-8000-000000000503'::uuid, 'Charles de Gaulle — l''homme du 18 juin',
   'Quelle grande réforme est votée en 1944 sous son gouvernement provisoire ?', 'mcq',
   '["Le droit de vote des femmes", "L''abolition de la peine de mort", "Les 35 heures", "Le baccalauréat"]', 0,
   'Le droit de vote des femmes est voté en 1944 ; premier vote en 1945. La Sécurité sociale suit en 1945.', 3),
  ('19010000-0000-4000-8000-000000000504'::uuid, 'Charles de Gaulle — l''homme du 18 juin',
   'Quelle crise ramène de Gaulle au pouvoir en 1958 ?', 'mcq',
   '["La guerre d''Algérie", "Mai 68", "La Seconde Guerre mondiale", "La crise de 1929"]', 0,
   'La crise du 13 mai 1958 à Alger provoque son retour et la fin de la IVe République.', 4),
  ('19010000-0000-4000-8000-000000000505'::uuid, 'Charles de Gaulle — l''homme du 18 juin',
   'Quel régime politique de Gaulle fonde-t-il en 1958 ?', 'mcq',
   '["La Ve République", "La IIIe République", "Le Second Empire", "La monarchie constitutionnelle"]', 0,
   'La Ve République, au pouvoir exécutif fort — le régime actuel de la France.', 5),
  ('19010000-0000-4000-8000-000000000506'::uuid, 'Charles de Gaulle — l''homme du 18 juin',
   'Que change le référendum de 1962 ?', 'mcq',
   '["Le président est élu au suffrage universel direct", "Le président est nommé par le Sénat", "La France quitte l''ONU", "Le vote devient obligatoire"]', 0,
   'Depuis 1962, tous les citoyens élisent directement le président de la République.', 6),
  ('19010000-0000-4000-8000-000000000507'::uuid, 'Charles de Gaulle — l''homme du 18 juin',
   'Quels accords de 1962 mettent fin à la guerre d''Algérie ?', 'mcq',
   '["Les accords d''Évian", "Les accords de Munich", "Le traité de Rome", "Les accords de Grenelle"]', 0,
   'Les accords d''Évian (mars 1962) ouvrent la voie à l''indépendance de l''Algérie.', 7),
  ('19010000-0000-4000-8000-000000000508'::uuid, 'Charles de Gaulle — l''homme du 18 juin',
   'La Sécurité sociale est créée en 1945, sous le gouvernement provisoire dirigé par de Gaulle.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : les ordonnances de 1945 fondent la Sécurité sociale.', 8),
  ('19010000-0000-4000-8000-000000000509'::uuid, 'Charles de Gaulle — l''homme du 18 juin',
   'Quel événement de 1968 conteste fortement son pouvoir ?', 'mcq',
   '["Mai 68 (révolte étudiante puis grève générale)", "La guerre d''Algérie", "La chute du mur de Berlin", "Le premier choc pétrolier"]', 0,
   'Mai 68 ébranle le régime ; de Gaulle démissionne l''année suivante, en 1969.', 9),
  ('19010000-0000-4000-8000-000000000510'::uuid, 'Charles de Gaulle — l''homme du 18 juin',
   'De Gaulle est resté président jusqu''à sa mort en 1970.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : il démissionne en 1969 après l''échec d''un référendum, et meurt en 1970 à Colombey.', 10)
) AS d(id, lesson, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'figures-historiques'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'tous' AND c.title = 'Figures historiques'
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = d.lesson
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
