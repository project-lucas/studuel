-- =============================================================================
-- Studuel — Migration 115 : CONTENU Histoire-Géo 3e (+ exercices type brevet)
-- Remplit les 5 chapitres d'Histoire-Géo 3e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder existant)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (3 → 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--   4. Exercices type brevet → lessons.content de « Exercices types » (position 2)
--                    2 exercices corrigés par chapitre (analyse de document,
--                    repères chronologiques, développement construit guidé).
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons Histoire-Géo 3e, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('La Première Guerre mondiale', $md$# La Première Guerre mondiale

## Ce que tu vas comprendre
Entre **1914 et 1918**, l'Europe se déchire dans un conflit d'une violence inédite : la **Grande Guerre**. Ce chapitre t'explique pourquoi on parle de **guerre totale**, ce que vivent les soldats et les civils, et comment cette guerre bouleverse le monde.

## 1. Une guerre déclenchée en 1914
En **août 1914**, les grandes puissances européennes s'affrontent en deux camps : la **Triple-Entente** (France, Royaume-Uni, Russie) contre la **Triple-Alliance** (Allemagne, Autriche-Hongrie…). Chacun croit à une guerre courte : ce sera une guerre longue de **quatre ans**.

## 2. La guerre des tranchées
Sur le **front ouest**, les armées s'enterrent dans des **tranchées** face à face. C'est la **guerre de position** : les soldats, les **poilus**, vivent dans la boue, sous les obus, au milieu des rats et des gaz.

*La bataille de **Verdun (1916)** devient le symbole de cette violence : des centaines de milliers de morts pour quelques kilomètres.*

## 3. Une guerre totale
La Première Guerre mondiale est une **guerre totale** : tout le pays est mobilisé.
- L'**économie** entière produit des armes ; les **femmes** remplacent les hommes à l'usine et aux champs.
- La **propagande** entretient le moral (« **bourrage de crâne** »).
- Les civils de l'arrière participent à l'effort de guerre.

## 4. Le génocide des Arméniens (1915)
En **1915**, l'Empire **ottoman** organise le massacre et la déportation des **Arméniens** : c'est le premier **génocide** du XXe siècle. Plus d'un million de victimes.

## 5. 1917-1918 : la fin de la guerre
- En **1917**, la **révolution russe** fait sortir la Russie du conflit, mais les **États-Unis** entrent en guerre.
- Le **11 novembre 1918**, l'Allemagne signe l'**armistice** : la guerre est finie.
- Le **traité de Versailles (1919)** impose une paix très dure à l'Allemagne.

## L'essentiel à retenir
- **1914-1918** : la Grande Guerre oppose la **Triple-Entente** à la **Triple-Alliance**.
- La **guerre des tranchées** (front ouest) et **Verdun (1916)** symbolisent la violence de masse.
- C'est une **guerre totale** : économie, femmes, civils et propagande mobilisés.
- **1915** : **génocide des Arméniens**. **11 novembre 1918** : armistice ; **Versailles (1919)** : la paix.$md$),

    ('L''Europe entre les deux guerres', $md$# L'Europe entre les deux guerres

## Ce que tu vas comprendre
Entre **1918 et 1939**, l'Europe passe de l'espoir de paix à la montée des dictatures. Une grave **crise économique** et des **régimes totalitaires** préparent une nouvelle guerre. Ce chapitre compare les démocraties fragiles à l'URSS de Staline et à l'Allemagne d'Hitler.

## 1. La crise économique de 1929
En **octobre 1929**, le **krach de Wall Street** (effondrement de la Bourse de New York) déclenche une crise mondiale, la **Grande Dépression**. Faillites, **chômage** de masse et misère frappent l'Europe et affaiblissent les démocraties.

## 2. Qu'est-ce qu'un régime totalitaire ?
Un **régime totalitaire** veut contrôler **toute** la société : un **parti unique**, un **chef** tout-puissant, une **propagande** permanente, une **police** qui traque les opposants, et pas de **libertés**.

## 3. L'URSS de Staline
En URSS, **Staline** installe une dictature communiste :
- **collectivisation** des terres (les paysans perdent leurs biens) et industrialisation forcée ;
- **terreur** contre les opposants (**Goulag**, grandes purges) ;
- **culte de la personnalité** et propagande.

## 4. L'Allemagne nazie d'Hitler
**Hitler**, chef du parti **nazi**, devient **chancelier en 1933**. Il établit une dictature :
- **parti unique**, suppression des libertés, camps de concentration ;
- une idéologie **raciste** et **antisémite** qui persécute les **Juifs** (lois de Nuremberg, 1935) ;
- une volonté de **revanche** et d'expansion qui menace la paix.

## 5. Vers la guerre
Les démocraties, affaiblies par la crise, tentent d'éviter le conflit. Mais Hitler multiplie les provocations. L'**invasion de la Pologne** en **septembre 1939** déclenche la Seconde Guerre mondiale.

## L'essentiel à retenir
- Le **krach de 1929** provoque la **Grande Dépression** et le chômage de masse.
- Un **régime totalitaire** = parti unique, chef, propagande, terreur, pas de libertés.
- **URSS** : Staline, collectivisation, Goulag, culte de la personnalité.
- **Allemagne nazie** : Hitler chancelier en **1933**, dictature **raciste et antisémite** ; la guerre éclate en 1939.$md$),

    ('La Seconde Guerre mondiale', $md$# La Seconde Guerre mondiale

## Ce que tu vas comprendre
De **1939 à 1945**, le monde connaît le conflit le plus meurtrier de l'histoire. Ce chapitre t'explique pourquoi on parle de **guerre d'anéantissement**, ce qu'est la **Shoah**, et comment la France résiste puis se libère.

## 1. Une guerre mondiale (1939-1945)
La guerre commence le **1er septembre 1939** avec l'invasion de la **Pologne** par l'Allemagne. Elle oppose les **forces de l'Axe** (Allemagne, Italie, Japon) aux **Alliés** (Royaume-Uni, URSS, États-Unis, France…). Elle se déroule sur presque tous les continents.

## 2. Une guerre d'anéantissement
C'est une **guerre d'anéantissement** : il ne s'agit plus seulement de vaincre l'ennemi, mais de le **détruire**. Les **civils** sont visés (bombardements de villes) et les combats atteignent une violence extrême, notamment sur le **front de l'Est**.

## 3. Le génocide des Juifs et des Tsiganes
Le régime nazi organise l'extermination des **Juifs** d'Europe : c'est la **Shoah**. Dans les **camps d'extermination** (comme **Auschwitz**), près de **six millions** de Juifs sont assassinés, ainsi que de nombreux **Tsiganes**. C'est un **génocide**.

## 4. La France : défaite, occupation, Résistance
- En **juin 1940**, la France est vaincue ; le régime de **Vichy** (Pétain) collabore avec l'Allemagne.
- Le **18 juin 1940**, le général **de Gaulle** appelle à continuer le combat : c'est le début de la **Résistance**.
- Les résistants mènent des actions clandestines (sabotages, renseignement).

## 5. 1944-1945 : la libération et la fin
- **6 juin 1944** : **débarquement** allié en **Normandie**.
- **8 mai 1945** : capitulation de l'Allemagne (fin de la guerre en Europe).
- **Août 1945** : les bombes **atomiques** sur **Hiroshima** et **Nagasaki** forcent la capitulation du Japon.

## L'essentiel à retenir
- **1939-1945** : l'**Axe** (Allemagne, Italie, Japon) contre les **Alliés**.
- Une **guerre d'anéantissement** qui vise aussi les **civils**.
- La **Shoah** : génocide des Juifs (près de 6 millions de morts, camps d'extermination).
- **18 juin 1940** : appel de **de Gaulle** ; **6 juin 1944** : débarquement de Normandie ; **8 mai 1945** : victoire en Europe.$md$),

    ('La France de 1944 à nos jours', $md$# La France de 1944 à nos jours

## Ce que tu vas comprendre
Depuis la **Libération** de 1944, la France s'est reconstruite, modernisée et transformée. Ce chapitre suit l'histoire politique (de la IVe à la Ve République) et les grandes évolutions de la société française.

## 1. 1944-1946 : refonder la République
À la **Libération**, la République est rétablie. Le **droit de vote des femmes** est enfin accordé (**1944**) : elles votent pour la première fois en 1945. La **IVe République** est mise en place en 1946, mais elle est politiquement **instable**.

## 2. La naissance de la Ve République (1958)
En **1958**, face à la crise de la guerre d'Algérie, le général **de Gaulle** revient au pouvoir et fonde la **Ve République**. Une nouvelle **Constitution** renforce le pouvoir du **président**. Depuis **1962**, le président est élu au **suffrage universel direct**.

## 3. Les Trente Glorieuses
De **1945 à 1975**, la France connaît une forte **croissance économique** : ce sont les **Trente Glorieuses**. La société se transforme :
- explosion de la **consommation** (voiture, électroménager, télévision) ;
- exode rural et essor des **villes** ;
- immigration de main-d'œuvre pour les usines.

## 4. Une société qui change
Les modes de vie évoluent profondément :
- la **place des femmes** progresse (travail, droits, contraception légalisée en 1967) ;
- la **jeunesse** s'affirme, notamment lors de **Mai 1968** ;
- l'**école** se démocratise et l'accès aux études s'élargit.

## 5. La France dans l'Europe et le monde
La France participe à la **construction européenne** dès les années 1950 (traité de Rome, **1957**). Après 1975, la **crise économique** et le **chômage** s'installent, mais la France reste une grande puissance et une démocratie.

## L'essentiel à retenir
- **1944** : droit de vote des **femmes** ; **IVe République** (1946), instable.
- **1958** : **de Gaulle** fonde la **Ve République** ; depuis **1962**, président élu au **suffrage universel direct**.
- **Trente Glorieuses** (1945-1975) : croissance, consommation, urbanisation.
- La société change (femmes, jeunesse, **Mai 1968**) et la France s'engage dans l'**Europe** (Rome, 1957).$md$),

    ('Les aires urbaines en France', $md$# Les aires urbaines en France

## Ce que tu vas comprendre
Aujourd'hui, la grande majorité des Français vivent dans des **aires urbaines**. Ce chapitre de géographie t'explique comment sont organisées les villes françaises, ce qu'est la **métropolisation** et pourquoi les habitants s'installent de plus en plus loin des centres.

## 1. Qu'est-ce qu'une aire urbaine ?
Une **aire urbaine** est un ensemble formé par une **ville-centre**, sa **banlieue** et sa **couronne périurbaine**, reliées par les déplacements quotidiens. Plus de **8 Français sur 10** vivent dans une aire urbaine.

## 2. La ville s'étale : la périurbanisation
De plus en plus d'habitants quittent le centre pour s'installer en **périphérie**, dans le **périurbain** (maisons individuelles, prix moins élevés). C'est la **périurbanisation**, qui provoque l'**étalement urbain** de la ville sur les campagnes.

## 3. Les migrations pendulaires
Ceux qui habitent loin du centre mais y travaillent font chaque jour des allers-retours : ce sont les **migrations pendulaires** (domicile-travail). Elles dépendent surtout de la **voiture** et provoquent des **embouteillages** et de la pollution.

## 4. La métropolisation
La **métropolisation** est la concentration des populations, des activités et des richesses dans les plus grandes villes, les **métropoles**. En France, **Paris** est de loin la plus grande aire urbaine ; viennent ensuite **Lyon**, **Marseille**, **Lille**, **Toulouse**…

## 5. Des espaces à aménager
Les aires urbaines posent des défis : **transports en commun**, **logement**, préservation des espaces agricoles menacés par l'étalement, réduction de la **pollution**. Les villes cherchent à devenir plus **durables**.

## L'essentiel à retenir
- Une **aire urbaine** = ville-centre + banlieue + **couronne périurbaine** ; plus de **8 Français sur 10** y vivent.
- La **périurbanisation** provoque l'**étalement urbain** de la ville sur les campagnes.
- Les **migrations pendulaires** (domicile-travail) reposent sur la voiture.
- La **métropolisation** concentre populations et richesses ; **Paris** est la première aire urbaine française.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('La Première Guerre mondiale', $json${
      "centre": "La Première Guerre mondiale",
      "branches": [
        { "titre": "1914 : la guerre éclate", "enfants": ["Triple-Entente vs Triple-Alliance", "Août 1914", "Une guerre longue (4 ans)"] },
        { "titre": "La guerre des tranchées", "enfants": ["Front ouest, guerre de position", "Les poilus dans la boue", "Verdun (1916)"] },
        { "titre": "Une guerre totale", "enfants": ["Économie mobilisée", "Les femmes à l'usine", "Propagande, civils de l'arrière"] },
        { "titre": "Génocide et fin", "enfants": ["Génocide des Arméniens (1915)", "Armistice : 11 novembre 1918", "Traité de Versailles (1919)"] }
      ]
    }$json$),
    ('L''Europe entre les deux guerres', $json${
      "centre": "L'Europe entre les deux guerres",
      "branches": [
        { "titre": "La crise de 1929", "enfants": ["Krach de Wall Street", "Grande Dépression", "Chômage de masse"] },
        { "titre": "Le totalitarisme", "enfants": ["Parti unique, un chef", "Propagande et terreur", "Aucune liberté"] },
        { "titre": "L'URSS de Staline", "enfants": ["Collectivisation des terres", "Goulag, grandes purges", "Culte de la personnalité"] },
        { "titre": "L'Allemagne nazie", "enfants": ["Hitler chancelier en 1933", "Dictature raciste et antisémite", "Vers la guerre (1939)"] }
      ]
    }$json$),
    ('La Seconde Guerre mondiale', $json${
      "centre": "La Seconde Guerre mondiale",
      "branches": [
        { "titre": "1939-1945", "enfants": ["Invasion de la Pologne (1939)", "Axe vs Alliés", "Une guerre mondiale"] },
        { "titre": "Guerre d'anéantissement", "enfants": ["Détruire l'ennemi", "Les civils visés", "Violence du front de l'Est"] },
        { "titre": "La Shoah", "enfants": ["Génocide des Juifs", "Camps d'extermination (Auschwitz)", "Près de 6 millions de morts"] },
        { "titre": "La France", "enfants": ["Vichy collabore (1940)", "Appel du 18 juin, de Gaulle", "Débarquement 6 juin 1944, 8 mai 1945"] }
      ]
    }$json$),
    ('La France de 1944 à nos jours', $json${
      "centre": "La France de 1944 à nos jours",
      "branches": [
        { "titre": "Refonder la République", "enfants": ["Vote des femmes (1944)", "IVe République (1946)", "Un régime instable"] },
        { "titre": "La Ve République", "enfants": ["De Gaulle en 1958", "Président renforcé", "Suffrage universel direct (1962)"] },
        { "titre": "Les Trente Glorieuses", "enfants": ["Croissance 1945-1975", "Consommation de masse", "Urbanisation, immigration"] },
        { "titre": "Une société qui change", "enfants": ["Place des femmes", "Mai 1968, jeunesse", "Construction européenne (Rome 1957)"] }
      ]
    }$json$),
    ('Les aires urbaines en France', $json${
      "centre": "Les aires urbaines en France",
      "branches": [
        { "titre": "L'aire urbaine", "enfants": ["Ville-centre + banlieue + couronne", "Plus de 8 Français sur 10", "Reliées par les déplacements"] },
        { "titre": "La périurbanisation", "enfants": ["S'installer en périphérie", "Maisons individuelles", "Étalement urbain"] },
        { "titre": "Migrations pendulaires", "enfants": ["Trajets domicile-travail", "Dépendance à la voiture", "Embouteillages, pollution"] },
        { "titre": "La métropolisation", "enfants": ["Concentration des richesses", "Paris, première aire urbaine", "Aménager des villes durables"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
 WHERE c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz 3e ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Histoire-Géo', '3e', v.chapter, true, l.id
FROM (VALUES
  ('11519999-0000-4000-8000-000000000001'::uuid, 'La Première Guerre mondiale'),
  ('11519999-0000-4000-8000-000000000002'::uuid, 'L''Europe entre les deux guerres'),
  ('11519999-0000-4000-8000-000000000003'::uuid, 'La Seconde Guerre mondiale'),
  ('11519999-0000-4000-8000-000000000004'::uuid, 'La France de 1944 à nos jours'),
  ('11519999-0000-4000-8000-000000000005'::uuid, 'Les aires urbaines en France')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
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
  -- Chapitre 1 — La Première Guerre mondiale
  ('11510000-0000-4000-8000-000000000104'::uuid, 'La Première Guerre mondiale',
   'En quelle année commence la Première Guerre mondiale ?', 'mcq',
   '["1914", "1918", "1939", "1789"]', 0,
   'La Première Guerre mondiale débute en août 1914 et se termine en 1918.', 4),
  ('11510000-0000-4000-8000-000000000105'::uuid, 'La Première Guerre mondiale',
   'Quelle grande bataille de 1916 symbolise la violence de la guerre ?', 'mcq',
   '["Verdun", "Waterloo", "Austerlitz", "Marignan"]', 0,
   'La bataille de Verdun (1916) est le symbole de la violence de masse de la Grande Guerre.', 5),
  ('11510000-0000-4000-8000-000000000106'::uuid, 'La Première Guerre mondiale',
   'À quelle date est signé l''armistice qui met fin aux combats ?', 'mcq',
   '["11 novembre 1918", "14 juillet 1918", "8 mai 1945", "1er septembre 1939"]', 0,
   'L''armistice est signé le 11 novembre 1918.', 6),
  ('11510000-0000-4000-8000-000000000107'::uuid, 'La Première Guerre mondiale',
   'La Première Guerre mondiale est une guerre totale qui mobilise l''économie et les civils.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Guerre totale : l''économie, les femmes à l''usine, la propagande et les civils sont mobilisés.', 7),
  ('11510000-0000-4000-8000-000000000108'::uuid, 'La Première Guerre mondiale',
   'Quel peuple est victime d''un génocide en 1915 ?', 'mcq',
   '["Les Arméniens", "Les Gaulois", "Les Vikings", "Les Aztèques"]', 0,
   'En 1915, l''Empire ottoman organise le génocide des Arméniens.', 8),
  ('11510000-0000-4000-8000-000000000109'::uuid, 'La Première Guerre mondiale',
   'Sur le front ouest, les soldats combattaient depuis des tranchées.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La guerre de position oppose les armées enterrées dans des tranchées sur le front ouest.', 9),
  ('11510000-0000-4000-8000-000000000110'::uuid, 'La Première Guerre mondiale',
   'Quel traité de 1919 impose une paix très dure à l''Allemagne ?', 'mcq',
   '["Le traité de Versailles", "Le traité de Rome", "Le traité de Maastricht", "L''édit de Nantes"]', 0,
   'Le traité de Versailles (1919) impose de lourdes conditions à l''Allemagne.', 10),

  -- Chapitre 2 — L'Europe entre les deux guerres
  ('11510000-0000-4000-8000-000000000204'::uuid, 'L''Europe entre les deux guerres',
   'En quelle année a lieu le krach boursier qui déclenche la crise mondiale ?', 'mcq',
   '["1929", "1914", "1945", "1958"]', 0,
   'Le krach de Wall Street a lieu en octobre 1929 et déclenche la Grande Dépression.', 4),
  ('11510000-0000-4000-8000-000000000205'::uuid, 'L''Europe entre les deux guerres',
   'Quel dirigeant met en place un régime totalitaire communiste en URSS ?', 'mcq',
   '["Staline", "Hitler", "Napoléon", "De Gaulle"]', 0,
   'Staline installe une dictature communiste totalitaire en URSS.', 5),
  ('11510000-0000-4000-8000-000000000206'::uuid, 'L''Europe entre les deux guerres',
   'En quelle année Hitler devient-il chancelier de l''Allemagne ?', 'mcq',
   '["1933", "1918", "1929", "1945"]', 0,
   'Hitler, chef du parti nazi, devient chancelier en 1933.', 6),
  ('11510000-0000-4000-8000-000000000207'::uuid, 'L''Europe entre les deux guerres',
   'Le régime nazi mène une politique raciste et antisémite.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le nazisme persécute les Juifs (lois de Nuremberg, 1935) au nom d''une idéologie raciste.', 7),
  ('11510000-0000-4000-8000-000000000208'::uuid, 'L''Europe entre les deux guerres',
   'Comment appelle-t-on la grave crise économique des années 1930 ?', 'mcq',
   '["La Grande Dépression", "Les Trente Glorieuses", "La Belle Époque", "La Renaissance"]', 0,
   'La crise déclenchée par le krach de 1929 est appelée la Grande Dépression.', 8),
  ('11510000-0000-4000-8000-000000000209'::uuid, 'L''Europe entre les deux guerres',
   'En URSS, Staline impose la collectivisation des terres agricoles.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Staline collectivise les terres : les paysans perdent leurs biens au profit de l''État.', 9),
  ('11510000-0000-4000-8000-000000000210'::uuid, 'L''Europe entre les deux guerres',
   'Quelle est la principale caractéristique politique d''un régime totalitaire ?', 'mcq',
   '["Un parti unique et un chef tout-puissant", "Des élections libres", "La liberté de la presse", "Le partage des pouvoirs"]', 0,
   'Un régime totalitaire repose sur un parti unique, un chef, la propagande et la terreur.', 10),

  -- Chapitre 3 — La Seconde Guerre mondiale
  ('11510000-0000-4000-8000-000000000304'::uuid, 'La Seconde Guerre mondiale',
   'Quel événement de 1939 déclenche la Seconde Guerre mondiale ?', 'mcq',
   '["L''invasion de la Pologne", "La prise de la Bastille", "Le krach de Wall Street", "La bataille de Verdun"]', 0,
   'L''invasion de la Pologne par l''Allemagne, le 1er septembre 1939, déclenche la guerre.', 4),
  ('11510000-0000-4000-8000-000000000305'::uuid, 'La Seconde Guerre mondiale',
   'Comment nomme-t-on le génocide des Juifs d''Europe par les nazis ?', 'mcq',
   '["La Shoah", "La Terreur", "La Grande Dépression", "La Reconquista"]', 0,
   'La Shoah est le génocide des Juifs d''Europe (près de 6 millions de morts).', 5),
  ('11510000-0000-4000-8000-000000000306'::uuid, 'La Seconde Guerre mondiale',
   'Qui lance l''appel du 18 juin 1940 à poursuivre le combat ?', 'mcq',
   '["Le général de Gaulle", "Le maréchal Pétain", "Adolf Hitler", "Georges Clemenceau"]', 0,
   'Le 18 juin 1940, le général de Gaulle appelle à la Résistance depuis Londres.', 6),
  ('11510000-0000-4000-8000-000000000307'::uuid, 'La Seconde Guerre mondiale',
   'La guerre se termine en Europe le 8 mai 1945.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La capitulation de l''Allemagne le 8 mai 1945 marque la fin de la guerre en Europe.', 7),
  ('11510000-0000-4000-8000-000000000308'::uuid, 'La Seconde Guerre mondiale',
   'À quelle date a lieu le débarquement allié en Normandie ?', 'mcq',
   '["6 juin 1944", "11 novembre 1918", "14 juillet 1789", "1er septembre 1939"]', 0,
   'Le débarquement de Normandie a lieu le 6 juin 1944.', 8),
  ('11510000-0000-4000-8000-000000000309'::uuid, 'La Seconde Guerre mondiale',
   'La Seconde Guerre mondiale est une guerre d''anéantissement qui vise aussi les civils.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Guerre d''anéantissement : il s''agit de détruire l''ennemi, y compris les populations civiles.', 9),
  ('11510000-0000-4000-8000-000000000310'::uuid, 'La Seconde Guerre mondiale',
   'En quelle année les bombes atomiques sont-elles larguées sur Hiroshima et Nagasaki ?', 'mcq',
   '["1945", "1939", "1918", "1929"]', 0,
   'Les bombes atomiques sur Hiroshima et Nagasaki datent d''août 1945.', 10),

  -- Chapitre 4 — La France de 1944 à nos jours
  ('11510000-0000-4000-8000-000000000404'::uuid, 'La France de 1944 à nos jours',
   'En quelle année est fondée la Ve République ?', 'mcq',
   '["1958", "1944", "1946", "1975"]', 0,
   'La Ve République est fondée en 1958 par le général de Gaulle.', 4),
  ('11510000-0000-4000-8000-000000000405'::uuid, 'La France de 1944 à nos jours',
   'Qui est le fondateur et premier président de la Ve République ?', 'mcq',
   '["Le général de Gaulle", "Le maréchal Pétain", "Napoléon", "Robespierre"]', 0,
   'Le général de Gaulle fonde la Ve République en 1958 et en devient le premier président.', 5),
  ('11510000-0000-4000-8000-000000000406'::uuid, 'La France de 1944 à nos jours',
   'En quelle année les femmes obtiennent-elles le droit de vote en France ?', 'mcq',
   '["1944", "1789", "1848", "1968"]', 0,
   'Le droit de vote des femmes est accordé en 1944 ; elles votent pour la première fois en 1945.', 6),
  ('11510000-0000-4000-8000-000000000407'::uuid, 'La France de 1944 à nos jours',
   'Les Trente Glorieuses désignent une période de forte croissance (1945-1975).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les Trente Glorieuses (1945-1975) sont une période de forte croissance et de consommation.', 7),
  ('11510000-0000-4000-8000-000000000408'::uuid, 'La France de 1944 à nos jours',
   'Depuis quelle année le président est-il élu au suffrage universel direct ?', 'mcq',
   '["1962", "1944", "1958", "1981"]', 0,
   'Depuis la réforme de 1962, le président de la République est élu au suffrage universel direct.', 8),
  ('11510000-0000-4000-8000-000000000409'::uuid, 'La France de 1944 à nos jours',
   'La IVe République (1946-1958) était un régime politiquement instable.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La IVe République, marquée par de nombreux changements de gouvernement, était instable.', 9),
  ('11510000-0000-4000-8000-000000000410'::uuid, 'La France de 1944 à nos jours',
   'Quel traité de 1957 marque une étape clé de la construction européenne ?', 'mcq',
   '["Le traité de Rome", "Le traité de Versailles", "Le traité de Vichy", "Le traité de Tordesillas"]', 0,
   'Le traité de Rome (1957) crée la Communauté économique européenne (CEE).', 10),

  -- Chapitre 5 — Les aires urbaines en France
  ('11510000-0000-4000-8000-000000000504'::uuid, 'Les aires urbaines en France',
   'De quoi est composée une aire urbaine ?', 'mcq',
   '["D''une ville-centre, sa banlieue et sa couronne périurbaine", "D''un seul champ agricole", "D''une forêt isolée", "D''une station de ski"]', 0,
   'Une aire urbaine réunit la ville-centre, sa banlieue et sa couronne périurbaine.', 4),
  ('11510000-0000-4000-8000-000000000505'::uuid, 'Les aires urbaines en France',
   'Quelle est la plus grande aire urbaine française ?', 'mcq',
   '["Paris", "Un village de campagne", "Une île déserte", "Un port de pêche isolé"]', 0,
   'Paris est de loin la plus grande aire urbaine de France, devant Lyon et Marseille.', 5),
  ('11510000-0000-4000-8000-000000000506'::uuid, 'Les aires urbaines en France',
   'Comment appelle-t-on le fait de s''installer en périphérie de la ville ?', 'mcq',
   '["La périurbanisation", "La désertification", "La littoralisation", "La déforestation"]', 0,
   'La périurbanisation est l''installation des habitants en périphérie ; elle provoque l''étalement urbain.', 6),
  ('11510000-0000-4000-8000-000000000507'::uuid, 'Les aires urbaines en France',
   'La métropolisation concentre les populations et les activités dans les grandes villes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La métropolisation concentre populations, activités et richesses dans les métropoles.', 7),
  ('11510000-0000-4000-8000-000000000508'::uuid, 'Les aires urbaines en France',
   'Comment nomme-t-on les trajets quotidiens domicile-travail ?', 'mcq',
   '["Les migrations pendulaires", "Les migrations définitives", "Le tourisme", "L''exode rural"]', 0,
   'Les migrations pendulaires sont les allers-retours quotidiens entre domicile et travail.', 8),
  ('11510000-0000-4000-8000-000000000509'::uuid, 'Les aires urbaines en France',
   'La grande majorité des Français vivent dans une aire urbaine.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Plus de 8 Français sur 10 vivent aujourd''hui dans une aire urbaine.', 9),
  ('11510000-0000-4000-8000-000000000510'::uuid, 'Les aires urbaines en France',
   'Comment appelle-t-on l''extension de la ville sur les espaces agricoles autour d''elle ?', 'mcq',
   '["L''étalement urbain", "La rétractation urbaine", "La concentration", "Le désenclavement"]', 0,
   'L''étalement urbain est l''extension de la ville sur les campagnes, liée à la périurbanisation.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BREVET — lessons.content de « Exercices types » (position 2)
--    2 exercices corrigés par chapitre (analyse de document, repères
--    chronologiques, développement construit guidé). Même jointure que le cours,
--    mais sur la leçon l.title = 'Exercices types'. Garde IS DISTINCT FROM.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('La Première Guerre mondiale', $md$# Exercices type brevet — La Première Guerre mondiale

## Exercice 1 — Analyse de document
**Document : lettre d'un poilu (1916, adaptée).**
« Cela fait trois jours que nous tenons la tranchée sous les obus. La boue nous monte aux genoux, les rats courent partout. Beaucoup de camarades sont tombés à Verdun. Nous tenons quand même, pour la France. »

**Questions**
1. De quel type de document s'agit-il et de quelle année date-t-il ?
2. Relève deux éléments qui décrivent les conditions de vie des soldats.
3. Quelle bataille est citée ? Pourquoi est-elle restée célèbre ?

### Correction
1. C'est un **témoignage** (une lettre) écrit par un soldat, un **poilu**, en **1916**, pendant la guerre.
2. Les conditions sont terribles : la **boue** (« jusqu'aux genoux »), les **rats**, les **obus** permanents et la mort des camarades. La vie dans les **tranchées** est dangereuse et insalubre.
3. La bataille citée est **Verdun (1916)**. Elle est restée célèbre car elle a fait des **centaines de milliers de morts** et symbolise la **violence de masse** de la Grande Guerre.

## Exercice 2 — Repères et développement construit
**Consigne :** montre, en un paragraphe organisé, pourquoi la Première Guerre mondiale est une **guerre totale**. Appuie-toi sur les repères ci-dessous.
- **1914** : début de la guerre ; **1916** : Verdun ; **11 novembre 1918** : armistice.

### Correction (proposition)
La Première Guerre mondiale, de **1914 à 1918**, est une **guerre totale** car elle mobilise l'ensemble de la société. D'abord, l'**économie** entière est tournée vers la guerre : les usines produisent des armes et les **femmes** remplacent les hommes partis au front. Ensuite, la violence est extrême, comme le montre la bataille de **Verdun (1916)**, et les combats se déroulent dans les **tranchées**. Enfin, l'**État** encadre les esprits par la **propagande**. La guerre ne s'achève qu'avec l'**armistice du 11 novembre 1918**. Ainsi, populations, économie et opinion sont toutes mobilisées : c'est bien une guerre totale.$md$),

    ('L''Europe entre les deux guerres', $md$# Exercices type brevet — L'Europe entre les deux guerres

## Exercice 1 — Analyse de document
**Document : affiche de propagande soviétique (années 1930, description).**
L'affiche montre **Staline** au centre, souriant, entouré d'ouvriers et de paysans heureux devant des usines et des tracteurs. Un slogan proclame : « Grâce au camarade Staline, la vie est plus belle ! »

**Questions**
1. Quel personnage est mis en avant et de quel pays s'agit-il ?
2. Quel est le but de cette affiche ?
3. En quoi cette image ne correspond-elle pas à la réalité du régime ?

### Correction
1. Le personnage est **Staline**, dirigeant de l'**URSS** (Union soviétique).
2. C'est une **affiche de propagande** : elle veut donner une image **positive** de Staline et de son régime, et développer le **culte de la personnalité**.
3. La réalité est très différente : le régime est une **dictature totalitaire**. La **collectivisation** ruine les paysans, la **terreur** et le **Goulag** frappent les opposants. L'image cache donc la répression et la misère.

## Exercice 2 — Repères et développement construit
**Consigne :** explique, dans un paragraphe organisé, ce qu'est un **régime totalitaire** en t'appuyant sur l'exemple de l'Allemagne nazie.
- Repère : **1929** krach ; **1933** Hitler chancelier.

### Correction (proposition)
Un **régime totalitaire** cherche à contrôler **toute** la société. En Allemagne, **Hitler** devient **chancelier en 1933**, profitant de la crise née du **krach de 1929**. Il installe alors une dictature : un seul **parti** (le parti nazi) est autorisé, les **libertés** sont supprimées et une **police** traque les opposants, enfermés dans des camps. La **propagande** encadre les esprits. Enfin, l'idéologie nazie est **raciste et antisémite** : elle persécute les **Juifs**. Ainsi, parti unique, terreur, propagande et absence de libertés définissent bien un régime totalitaire.$md$),

    ('La Seconde Guerre mondiale', $md$# Exercices type brevet — La Seconde Guerre mondiale

## Exercice 1 — Analyse de document
**Document : extrait de l'appel du 18 juin 1940 (adapté).**
« La France a perdu une bataille ! Mais la France n'a pas perdu la guerre ! […] J'invite les officiers et les soldats français à se mettre en liaison avec moi. Quoi qu'il arrive, la flamme de la résistance française ne doit pas s'éteindre. »

**Questions**
1. Qui est l'auteur de ce texte et à quelle date le prononce-t-il ?
2. Que demande-t-il aux Français ?
3. Quel mouvement cet appel fait-il naître ?

### Correction
1. L'auteur est le **général de Gaulle**, qui prononce cet appel depuis Londres le **18 juin 1940**.
2. Il demande aux Français, et surtout aux soldats, de **continuer le combat** et de le rejoindre, malgré la défaite.
3. Cet appel marque le début de la **Résistance** française contre l'occupant allemand et le régime de Vichy.

## Exercice 2 — Repères et développement construit
**Consigne :** montre, dans un paragraphe organisé, pourquoi la Seconde Guerre mondiale est une **guerre d'anéantissement**.
- Repères : **1939** début ; **6 juin 1944** débarquement ; **8 mai 1945** victoire en Europe.

### Correction (proposition)
La Seconde Guerre mondiale, de **1939 à 1945**, est une **guerre d'anéantissement** car il ne s'agit plus seulement de vaincre l'ennemi mais de le **détruire**. Les **civils** sont directement visés par les bombardements de villes, et les combats du **front de l'Est** atteignent une violence extrême. Surtout, le régime nazi organise un **génocide**, la **Shoah** : dans les **camps d'extermination** comme Auschwitz, près de **six millions** de Juifs sont assassinés. Après le **débarquement du 6 juin 1944**, les Alliés libèrent l'Europe jusqu'à la victoire du **8 mai 1945**. Cette volonté de destruction totale fait bien de ce conflit une guerre d'anéantissement.$md$),

    ('La France de 1944 à nos jours', $md$# Exercices type brevet — La France de 1944 à nos jours

## Exercice 1 — Analyse de document
**Document : affiche pour le premier vote des femmes (1945, description).**
L'affiche montre une femme glissant un **bulletin** dans une urne, avec la mention : « Pour la première fois, les Françaises votent. » Autour, d'autres femmes attendent leur tour.

**Questions**
1. Quel droit nouveau cette affiche met-elle en avant ?
2. En quelle année ce droit a-t-il été accordé aux femmes ?
3. En quoi cet événement est-il une avancée pour la démocratie ?

### Correction
1. L'affiche met en avant le **droit de vote des femmes**.
2. Ce droit est accordé en **1944** ; les femmes votent pour la **première fois en 1945**.
3. C'est une avancée majeure car la **moitié de la population** (les femmes) obtient enfin la **citoyenneté politique**. La démocratie devient plus **égalitaire** et le suffrage réellement **universel**.

## Exercice 2 — Repères et développement construit
**Consigne :** présente, dans un paragraphe organisé, les grandes évolutions politiques de la France depuis 1944.
- Repères : **1944** vote des femmes ; **1958** Ve République ; **1962** suffrage universel direct.

### Correction (proposition)
Depuis la **Libération de 1944**, la vie politique française a beaucoup changé. D'abord, la République est refondée et le **droit de vote des femmes** est accordé en **1944**. La **IVe République** (1946) se révèle cependant **instable**. En **1958**, face à la crise algérienne, le général **de Gaulle** fonde la **Ve République**, qui renforce le pouvoir du **président**. Depuis **1962**, celui-ci est élu au **suffrage universel direct**. Parallèlement, la société se transforme (Trente Glorieuses, place des femmes, Mai 1968) et la France s'engage dans la **construction européenne**. La France est ainsi devenue une démocratie stable et moderne.$md$),

    ('Les aires urbaines en France', $md$# Exercices type brevet — Les aires urbaines en France

## Exercice 1 — Analyse de document (carte / schéma)
**Document : schéma d'une aire urbaine (description).**
Le schéma présente trois zones concentriques : au centre, la **ville-centre** ; autour, la **banlieue** ; et à l'extérieur, une large **couronne périurbaine** avec des maisons individuelles. Des flèches relient la périphérie au centre.

**Questions**
1. Nomme les trois espaces qui composent une aire urbaine.
2. Que représentent les flèches qui vont de la périphérie vers le centre ?
3. Comment appelle-t-on le fait que la ville s'étende ainsi sur les campagnes ?

### Correction
1. Une aire urbaine est composée de la **ville-centre**, de la **banlieue** et de la **couronne périurbaine**.
2. Les flèches représentent les **migrations pendulaires** : les déplacements quotidiens **domicile-travail** des habitants de la périphérie vers le centre.
3. On appelle ce phénomène l'**étalement urbain**, provoqué par la **périurbanisation**.

## Exercice 2 — Repères et développement construit
**Consigne :** explique, dans un paragraphe organisé, comment sont organisées et comment évoluent les aires urbaines en France.
- Repères : plus de **8 Français sur 10** vivent en aire urbaine ; **Paris** est la première aire urbaine.

### Correction (proposition)
En France, plus de **8 habitants sur 10** vivent dans une **aire urbaine**, c'est-à-dire un ensemble formé par une **ville-centre**, sa **banlieue** et sa **couronne périurbaine**. Ces espaces sont reliés par les **migrations pendulaires**, les trajets quotidiens domicile-travail qui dépendent surtout de la **voiture**. Les villes connaissent aussi la **périurbanisation** : de nombreux habitants s'installent en périphérie, ce qui provoque l'**étalement urbain** sur les campagnes. Enfin, la **métropolisation** concentre les populations et les richesses dans les plus grandes villes, comme **Paris**, la première aire urbaine française. Les aires urbaines doivent donc relever des défis de transport, de logement et d'environnement.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
