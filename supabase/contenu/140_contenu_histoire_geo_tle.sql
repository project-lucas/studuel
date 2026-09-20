-- =============================================================================
-- Studuel — Migration 140 : CONTENU Histoire-Géo Tle (+ exercices type bac)
-- Remplit les 5 chapitres d'Histoire-Géo Terminale (programme officiel) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices bac  → lessons.content de « Exercices types » (position 2) :
--                       2 exercices type bac corrigés par chapitre.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Démocraties fragiles et totalitarismes', $md$# Démocraties fragiles et totalitarismes

## Ce que tu vas comprendre
Dans les années 1930, la crise économique et les séquelles de la Première Guerre mondiale fragilisent les démocraties européennes. Trois régimes totalitaires s'imposent : l'Italie fasciste, l'Allemagne nazie et l'URSS stalinienne. Ce chapitre compare leurs points communs et leurs différences.

## 1. Des démocraties fragilisées
La crise de 1929, partie des États-Unis, plonge le monde dans une dépression économique : chômage de masse, faillites, misère. En Europe, les démocraties sont contestées. En France, le Front populaire arrive au pouvoir en 1936 et mène des réformes sociales (congés payés), mais la République reste fragile.

## 2. L'Italie fasciste
Mussolini prend le pouvoir après la Marche sur Rome (1922). Il installe un régime à parti unique, muselle la presse, encadre la jeunesse et développe le culte du « Duce ». C'est le premier régime fasciste d'Europe.

## 3. L'Allemagne nazie
Hitler devient chancelier en janvier 1933. Il instaure le IIIe Reich, une dictature fondée sur le culte du Führer, la terreur (Gestapo, camps) et un racisme d'État. Les lois de Nuremberg (1935) excluent les Juifs de la communauté nationale : l'antisémitisme est au cœur de l'idéologie nazie.

## 4. L'URSS stalinienne
Staline dirige l'URSS d'une main de fer. L'État contrôle toute l'économie (planification, collectivisation des terres). La Grande Terreur (1937-1938) élimine les opposants réels ou supposés ; des millions de personnes sont déportées au goulag. Le culte du « petit père des peuples » est omniprésent.

## 5. Points communs et différences
Les trois régimes sont totalitaires : parti unique, chef charismatique, propagande, encadrement de la population, terreur policière, refus des libertés. Mais leurs idéologies diffèrent : le communisme soviétique veut une société sans classes, quand le nazisme repose sur le racisme et la hiérarchie des « races ».

## L'essentiel à retenir
- La crise de 1929 fragilise les démocraties et favorise les extrémismes.
- Trois totalitarismes : fascisme (Mussolini), nazisme (Hitler), stalinisme (Staline).
- Points communs : parti unique, propagande, terreur, culte du chef.
- Différence majeure : le nazisme est fondé sur le racisme et l'antisémitisme d'État.$md$),

    ('La Seconde Guerre mondiale', $md$# La Seconde Guerre mondiale

## Ce que tu vas comprendre
De 1939 à 1945, la Seconde Guerre mondiale est un conflit d'une violence inédite : une « guerre d'anéantissement » qui vise les armées mais aussi les civils. Elle culmine avec le génocide des Juifs et des Tsiganes.

## 1. Une guerre mondiale (1939-1945)
La guerre commence le 1er septembre 1939 avec l'invasion de la Pologne par l'Allemagne. La « Blitzkrieg » (guerre éclair) permet aux nazis de dominer l'Europe. En 1941, le conflit devient mondial : l'Allemagne attaque l'URSS (opération Barbarossa) et le Japon bombarde Pearl Harbor, faisant entrer les États-Unis dans la guerre.

## 2. Une guerre d'anéantissement
Les combats mobilisent toutes les ressources des États (guerre totale) et ne connaissent aucune limite : bombardements de villes, massacres de civils, prisonniers exterminés. Sur le front de l'Est, la guerre est particulièrement barbare.

## 3. La Shoah et les génocides
Les nazis organisent l'extermination systématique des Juifs d'Europe : c'est la Shoah. La conférence de Wannsee (janvier 1942) planifie la « solution finale ». Les victimes sont fusillées par les Einsatzgruppen ou gazées dans des camps d'extermination comme Auschwitz-Birkenau. Environ six millions de Juifs sont assassinés, ainsi que des centaines de milliers de Tsiganes.

## 4. Les tournants et la victoire alliée
En 1942-1943, le vent tourne : victoire soviétique à Stalingrad, débarquements alliés. Le 6 juin 1944, les Alliés débarquent en Normandie. L'Allemagne capitule le 8 mai 1945.

## 5. La fin de la guerre et le bilan
Pour forcer la reddition du Japon, les États-Unis larguent deux bombes atomiques sur Hiroshima et Nagasaki en août 1945 ; le Japon capitule le 2 septembre 1945. Le bilan est effroyable : environ 60 millions de morts, en majorité des civils. En 1945 naît l'ONU pour préserver la paix.

## L'essentiel à retenir
- 1939-1945 : une guerre mondiale et une guerre d'anéantissement.
- Dates clés : 1er septembre 1939, 6 juin 1944, 8 mai 1945, août 1945 (bombes atomiques).
- La Shoah : génocide des Juifs (≈ 6 millions de morts), camps d'extermination.
- Bilan : ≈ 60 millions de morts ; création de l'ONU en 1945.$md$),

    ('La Guerre froide', $md$# La Guerre froide

## Ce que tu vas comprendre
De 1947 à 1991, le monde est partagé en deux blocs rivaux, dirigés par les États-Unis et l'URSS. Cette « guerre froide » oppose deux modèles sans affrontement militaire direct entre les deux Grands.

## 1. La formation des blocs (1947)
En 1947, les États-Unis lancent la doctrine Truman (« endiguer » le communisme) et le plan Marshall (aide économique à l'Europe). L'URSS répond par la doctrine Jdanov. Le monde se coupe en deux : bloc de l'Ouest (capitaliste, démocratique) et bloc de l'Est (communiste). Un « rideau de fer » sépare l'Europe.

## 2. Berlin, symbole de la guerre froide
Berlin, ville divisée, est au cœur des tensions. Lors du blocus de Berlin (1948-1949), les Occidentaux ravitaillent la ville par un pont aérien. En 1961, l'URSS fait construire le mur de Berlin, qui devient le symbole de la coupure du monde.

## 3. Deux modèles opposés
Le modèle américain défend la démocratie libérale, l'économie de marché et la société de consommation. Le modèle soviétique promeut le parti unique, l'économie planifiée et l'égalité affichée. Chaque camp cherche à imposer son modèle.

## 4. Crises et décolonisation
La guerre froide connaît des crises graves : guerre de Corée, crise des fusées de Cuba (1962), où le monde frôle la guerre nucléaire. Parallèlement, les empires coloniaux s'effondrent : l'Inde est indépendante en 1947, l'Afrique se décolonise dans les années 1960. La France mène la guerre d'Algérie (1954-1962). Les nouveaux pays du Tiers-monde se réunissent à Bandung (1955).

## 5. La fin de la guerre froide
Après une période de « détente », le bloc soviétique s'effondre. Le mur de Berlin tombe le 9 novembre 1989 et l'URSS disparaît en 1991 : les États-Unis restent la seule superpuissance.

## L'essentiel à retenir
- 1947-1991 : un monde bipolaire (États-Unis / URSS), deux modèles opposés.
- 1947 : doctrine Truman, plan Marshall ; « rideau de fer ».
- Crises : blocus de Berlin (1948-49), mur de Berlin (1961), Cuba (1962).
- Décolonisation (Inde 1947, Algérie 1954-1962) ; chute du mur en 1989, fin de l'URSS en 1991.$md$),

    ('Mers et océans dans la mondialisation', $md$# Mers et océans dans la mondialisation

## Ce que tu vas comprendre
Les mers et les océans sont au cœur de la mondialisation : ils portent l'essentiel des échanges, regorgent de ressources et deviennent des espaces de tensions. On parle de « maritimisation » de l'économie mondiale.

## 1. Des espaces au cœur des échanges
Environ 80 % du commerce mondial de marchandises transite par la mer. La conteneurisation a révolutionné le transport. Les grandes routes maritimes relient les façades les plus actives (Asie de l'Est, Europe, Amérique du Nord) et passent par des points stratégiques.

## 2. Des passages stratégiques
Certains lieux sont vitaux pour le commerce : le canal de Suez (Méditerranée–mer Rouge), le canal de Panama, et des détroits comme Malacca, Ormuz ou Gibraltar. Leur contrôle est un enjeu majeur ; le moindre blocage perturbe l'économie mondiale.

## 3. Des ressources convoitées
Les océans offrent des ressources : halieutiques (pêche), hydrocarbures offshore (pétrole, gaz), énergies marines renouvelables, et minerais des grands fonds. Cette exploitation crée des rivalités entre États.

## 4. Un espace disputé et à protéger
La convention de Montego Bay (1982) fixe le droit de la mer : chaque État côtier dispose d'une zone économique exclusive (ZEE) jusqu'à 200 milles nautiques. Des tensions éclatent, notamment en mer de Chine méridionale. S'y ajoutent la piraterie et de graves enjeux environnementaux (pollution, surpêche).

## 5. Des façades et des ports mondiaux
Les échanges se concentrent sur de grandes façades maritimes équipées de ports géants (Shanghai, Singapour, Rotterdam). Ces hubs sont les portes d'entrée de la mondialisation et structurent le commerce planétaire.

## L'essentiel à retenir
- Maritimisation : ≈ 80 % du commerce mondial se fait par la mer.
- Passages stratégiques : canaux de Suez et Panama, détroits de Malacca, d'Ormuz, de Gibraltar.
- Ressources : pêche, hydrocarbures offshore, énergies, minerais des fonds.
- ZEE (200 milles) fixée par la convention de Montego Bay (1982) ; tensions en mer de Chine méridionale.$md$),

    ('L''Union européenne dans la mondialisation', $md$# L'Union européenne dans la mondialisation

## Ce que tu vas comprendre
L'Union européenne (UE) est une construction originale : 27 États qui mettent en commun une partie de leur souveraineté. C'est une grande puissance économique, mais une puissance incomplète, traversée de disparités.

## 1. Une construction progressive
La construction européenne commence après 1945 pour garantir la paix. La CECA (1951), puis le traité de Rome (1957) lancent le Marché commun. Le traité de Maastricht (1992) crée l'Union européenne et prépare la monnaie unique, l'euro. Les élargissements successifs portent l'UE à 27 membres.

## 2. Une puissance économique mondiale
L'UE forme un vaste marché unique et l'une des premières puissances commerciales du monde. Elle pèse dans les échanges mondiaux et sa monnaie, l'euro, est utilisée par de nombreux pays membres.

## 3. Des frontières particulières
L'espace Schengen permet la libre circulation des personnes à l'intérieur de l'UE. Les frontières extérieures sont surveillées (agence Frontex) et font l'objet de forts enjeux migratoires. Le Brexit (sortie du Royaume-Uni en 2020) rappelle que ces frontières peuvent évoluer.

## 4. Des disparités territoriales
Le territoire de l'UE est inégal : des régions très riches (grandes métropoles, dorsale européenne) côtoient des régions plus pauvres. Pour réduire ces écarts, l'UE mène une politique de cohésion qui aide les régions en difficulté.

## 5. Une puissance dans la mondialisation
L'UE s'insère dans la mondialisation par ses ports : la « Northern Range » (Rotterdam, Anvers, Hambourg) est une immense façade maritime. Mais l'UE reste une puissance incomplète : elle n'a pas de véritable défense commune ni de politique étrangère unifiée.

## L'essentiel à retenir
- Étapes : CECA (1951), traité de Rome (1957), Maastricht (1992, UE + euro), 27 membres.
- Une grande puissance commerciale et un marché unique.
- Frontières : espace Schengen (libre circulation), Frontex, Brexit (2020).
- Disparités corrigées par la politique de cohésion ; façade portuaire de la Northern Range.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Démocraties fragiles et totalitarismes', $json${
      "centre": "Démocraties fragiles et totalitarismes",
      "branches": [
        { "titre": "Démocraties fragilisées", "enfants": ["Crise de 1929", "Chômage, misère", "Front populaire 1936"] },
        { "titre": "Italie fasciste", "enfants": ["Mussolini, Marche sur Rome 1922", "Parti unique, culte du Duce", "Premier régime fasciste"] },
        { "titre": "Allemagne nazie", "enfants": ["Hitler chancelier 1933", "IIIe Reich, culte du Führer", "Lois de Nuremberg 1935, antisémitisme"] },
        { "titre": "URSS stalinienne", "enfants": ["Staline, économie planifiée", "Grande Terreur 1937-1938", "Goulag, culte du chef"] }
      ]
    }$json$),
    ('La Seconde Guerre mondiale', $json${
      "centre": "La Seconde Guerre mondiale",
      "branches": [
        { "titre": "Une guerre mondiale", "enfants": ["1939 : invasion de la Pologne", "Blitzkrieg", "1941 : URSS et Pearl Harbor"] },
        { "titre": "Guerre d'anéantissement", "enfants": ["Guerre totale", "Civils visés", "Front de l'Est barbare"] },
        { "titre": "La Shoah", "enfants": ["Génocide des Juifs (≈ 6 millions)", "Wannsee 1942, solution finale", "Auschwitz-Birkenau"] },
        { "titre": "Victoire et bilan", "enfants": ["6 juin 1944 : Normandie", "8 mai 1945 : capitulation", "Hiroshima/Nagasaki, ONU 1945"] }
      ]
    }$json$),
    ('La Guerre froide', $json${
      "centre": "La Guerre froide",
      "branches": [
        { "titre": "Deux blocs (1947)", "enfants": ["Doctrine Truman, plan Marshall", "Doctrine Jdanov", "Rideau de fer"] },
        { "titre": "Berlin", "enfants": ["Blocus 1948-1949", "Pont aérien", "Mur de Berlin 1961"] },
        { "titre": "Deux modèles", "enfants": ["Ouest : démocratie, marché", "Est : parti unique, plan", "Crise de Cuba 1962"] },
        { "titre": "Décolonisation et fin", "enfants": ["Inde 1947, Algérie 1954-1962", "Bandung 1955, Tiers-monde", "Chute du mur 1989, fin URSS 1991"] }
      ]
    }$json$),
    ('Mers et océans dans la mondialisation', $json${
      "centre": "Mers et océans dans la mondialisation",
      "branches": [
        { "titre": "Maritimisation", "enfants": ["≈ 80 % du commerce par la mer", "Conteneurisation", "Grandes routes maritimes"] },
        { "titre": "Passages stratégiques", "enfants": ["Canaux de Suez et Panama", "Détroits de Malacca, Ormuz", "Gibraltar"] },
        { "titre": "Ressources", "enfants": ["Pêche (halieutiques)", "Hydrocarbures offshore", "Énergies, minerais des fonds"] },
        { "titre": "Tensions et droit", "enfants": ["ZEE 200 milles", "Montego Bay 1982", "Mer de Chine méridionale"] }
      ]
    }$json$),
    ('L''Union européenne dans la mondialisation', $json${
      "centre": "L'Union européenne dans la mondialisation",
      "branches": [
        { "titre": "Construction", "enfants": ["CECA 1951, Rome 1957", "Maastricht 1992 : UE + euro", "27 membres"] },
        { "titre": "Puissance", "enfants": ["Marché unique", "Grande puissance commerciale", "Monnaie : l'euro"] },
        { "titre": "Frontières", "enfants": ["Espace Schengen", "Frontex, enjeux migratoires", "Brexit 2020"] },
        { "titre": "Disparités", "enfants": ["Régions riches / pauvres", "Politique de cohésion", "Northern Range (Rotterdam…)"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz Tle ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Histoire-Géo', 'Tle', v.chapter, true, l.id
FROM (VALUES
  ('14019999-0000-4000-8000-000000000001'::uuid, 'Démocraties fragiles et totalitarismes'),
  ('14019999-0000-4000-8000-000000000002'::uuid, 'La Seconde Guerre mondiale'),
  ('14019999-0000-4000-8000-000000000003'::uuid, 'La Guerre froide'),
  ('14019999-0000-4000-8000-000000000004'::uuid, 'Mers et océans dans la mondialisation'),
  ('14019999-0000-4000-8000-000000000005'::uuid, 'L''Union européenne dans la mondialisation')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
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
  -- Chapitre 1 — Démocraties fragiles et totalitarismes
  ('14010000-0000-4000-8000-000000000104'::uuid, 'Démocraties fragiles et totalitarismes',
   'En quelle année Hitler devient-il chancelier d''Allemagne ?', 'mcq',
   '["1933", "1929", "1936", "1939"]', 0,
   'Hitler est nommé chancelier en janvier 1933 ; il instaure ensuite le IIIe Reich.', 4),
  ('14010000-0000-4000-8000-000000000105'::uuid, 'Démocraties fragiles et totalitarismes',
   'Qui dirige l''URSS totalitaire des années 1930 ?', 'mcq',
   '["Staline", "Lénine", "Trotski", "Khrouchtchev"]', 0,
   'Staline dirige l''URSS d''une main de fer : planification, collectivisation, Grande Terreur.', 5),
  ('14010000-0000-4000-8000-000000000106'::uuid, 'Démocraties fragiles et totalitarismes',
   'Les lois de Nuremberg (1935) privent les Juifs allemands de leurs droits de citoyens.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ces lois excluent les Juifs de la communauté nationale : l''antisémitisme est au cœur du nazisme.', 6),
  ('14010000-0000-4000-8000-000000000107'::uuid, 'Démocraties fragiles et totalitarismes',
   'Comment appelle-t-on les camps soviétiques de travail forcé ?', 'mcq',
   '["Le goulag", "Le ghetto", "Le Reich", "Le kolkhoze"]', 0,
   'Le goulag désigne le système des camps de travail forcé en URSS.', 7),
  ('14010000-0000-4000-8000-000000000108'::uuid, 'Démocraties fragiles et totalitarismes',
   'La Marche sur Rome (1922) permet l''arrivée au pouvoir de : ', 'mcq',
   '["Mussolini", "Hitler", "Franco", "Staline"]', 0,
   'Mussolini prend le pouvoir en Italie après la Marche sur Rome (1922) : premier régime fasciste.', 8),
  ('14010000-0000-4000-8000-000000000109'::uuid, 'Démocraties fragiles et totalitarismes',
   'Un régime totalitaire respecte le pluralisme des partis politiques.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : un régime totalitaire repose sur un parti unique et supprime les libertés.', 9),
  ('14010000-0000-4000-8000-000000000110'::uuid, 'Démocraties fragiles et totalitarismes',
   'Le Front populaire arrive au pouvoir en France en : ', 'mcq',
   '["1936", "1929", "1940", "1933"]', 0,
   'Le Front populaire gagne les élections de 1936 et mène des réformes sociales (congés payés).', 10),

  -- Chapitre 2 — La Seconde Guerre mondiale
  ('14010000-0000-4000-8000-000000000204'::uuid, 'La Seconde Guerre mondiale',
   'Quel événement marque le début de la Seconde Guerre mondiale en Europe ?', 'mcq',
   '["L''invasion de la Pologne", "Le débarquement de Normandie", "La bataille de Stalingrad", "Pearl Harbor"]', 0,
   'La guerre commence le 1er septembre 1939 avec l''invasion de la Pologne par l''Allemagne.', 4),
  ('14010000-0000-4000-8000-000000000205'::uuid, 'La Seconde Guerre mondiale',
   'En quelle année a lieu le débarquement de Normandie ?', 'mcq',
   '["1944", "1940", "1942", "1945"]', 0,
   'Le débarquement allié en Normandie a lieu le 6 juin 1944.', 5),
  ('14010000-0000-4000-8000-000000000206'::uuid, 'La Seconde Guerre mondiale',
   'La Shoah désigne le génocide des Juifs d''Europe par les nazis.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La Shoah est l''extermination systématique des Juifs d''Europe (≈ 6 millions de morts).', 6),
  ('14010000-0000-4000-8000-000000000207'::uuid, 'La Seconde Guerre mondiale',
   'Quel camp d''extermination est devenu le symbole de la Shoah ?', 'mcq',
   '["Auschwitz-Birkenau", "Verdun", "Yalta", "Vichy"]', 0,
   'Auschwitz-Birkenau, principal camp d''extermination nazi, est devenu le symbole de la Shoah.', 7),
  ('14010000-0000-4000-8000-000000000208'::uuid, 'La Seconde Guerre mondiale',
   'Les bombes atomiques de 1945 ont été larguées sur : ', 'mcq',
   '["Hiroshima et Nagasaki", "Tokyo et Kyoto", "Berlin et Dresde", "Pékin et Shanghai"]', 0,
   'Les États-Unis larguent deux bombes atomiques sur Hiroshima et Nagasaki en août 1945.', 8),
  ('14010000-0000-4000-8000-000000000209'::uuid, 'La Seconde Guerre mondiale',
   'La capitulation allemande a lieu le 8 mai 1945.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''Allemagne capitule le 8 mai 1945 ; le Japon capitulera le 2 septembre 1945.', 9),
  ('14010000-0000-4000-8000-000000000210'::uuid, 'La Seconde Guerre mondiale',
   'La conférence de Wannsee (janvier 1942) organise : ', 'mcq',
   '["La « solution finale »", "Le débarquement allié", "Le plan Marshall", "La création de l''ONU"]', 0,
   'À Wannsee (janvier 1942), les nazis planifient la « solution finale », l''extermination des Juifs.', 10),

  -- Chapitre 3 — La Guerre froide
  ('14010000-0000-4000-8000-000000000304'::uuid, 'La Guerre froide',
   'Entre quelles superpuissances se déroule la guerre froide ?', 'mcq',
   '["Les États-Unis et l''URSS", "La France et l''Allemagne", "La Chine et le Japon", "Le Royaume-Uni et l''URSS"]', 0,
   'La guerre froide oppose les deux Grands : les États-Unis et l''URSS.', 4),
  ('14010000-0000-4000-8000-000000000305'::uuid, 'La Guerre froide',
   'En quelle année le mur de Berlin est-il construit ?', 'mcq',
   '["1961", "1945", "1949", "1989"]', 0,
   'Le mur de Berlin est construit en 1961 ; il tombe le 9 novembre 1989.', 5),
  ('14010000-0000-4000-8000-000000000306'::uuid, 'La Guerre froide',
   'Le plan Marshall (1947) est une aide économique américaine à l''Europe.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le plan Marshall (1947) est une aide économique des États-Unis pour reconstruire l''Europe.', 6),
  ('14010000-0000-4000-8000-000000000307'::uuid, 'La Guerre froide',
   'La crise des fusées de Cuba a lieu en : ', 'mcq',
   '["1962", "1947", "1956", "1975"]', 0,
   'En 1962, la crise de Cuba amène le monde au bord de la guerre nucléaire.', 7),
  ('14010000-0000-4000-8000-000000000308'::uuid, 'La Guerre froide',
   'Quel mur tombe le 9 novembre 1989 ?', 'mcq',
   '["Le mur de Berlin", "La ligne Maginot", "Le rideau de fer chinois", "Le mur de l''Atlantique"]', 0,
   'La chute du mur de Berlin, le 9 novembre 1989, annonce la fin de la guerre froide.', 8),
  ('14010000-0000-4000-8000-000000000309'::uuid, 'La Guerre froide',
   'L''URSS disparaît en 1991.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''URSS est dissoute en 1991 : les États-Unis restent la seule superpuissance.', 9),
  ('14010000-0000-4000-8000-000000000310'::uuid, 'La Guerre froide',
   'La conférence de Bandung (1955) réunit surtout des pays : ', 'mcq',
   '["du Tiers-monde / non-alignés", "de l''OTAN", "du bloc soviétique uniquement", "d''Amérique du Nord"]', 0,
   'À Bandung (1955), les jeunes États du Tiers-monde affirment leur volonté de non-alignement.', 10),

  -- Chapitre 4 — Mers et océans dans la mondialisation
  ('14010000-0000-4000-8000-000000000404'::uuid, 'Mers et océans dans la mondialisation',
   'Environ quelle part du commerce mondial de marchandises transite par la mer ?', 'mcq',
   '["80 %", "20 %", "50 %", "10 %"]', 0,
   'Environ 80 % du commerce mondial de marchandises passe par la voie maritime.', 4),
  ('14010000-0000-4000-8000-000000000405'::uuid, 'Mers et océans dans la mondialisation',
   'Comment appelle-t-on la mise en valeur croissante des mers par les sociétés ?', 'mcq',
   '["La maritimisation", "La désertification", "La métropolisation", "La littoralisation glaciaire"]', 0,
   'La maritimisation désigne l''importance croissante des mers dans l''économie mondiale.', 5),
  ('14010000-0000-4000-8000-000000000406'::uuid, 'Mers et océans dans la mondialisation',
   'La ZEE (zone économique exclusive) s''étend jusqu''à 200 milles nautiques des côtes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La ZEE s''étend jusqu''à 200 milles nautiques, selon la convention de Montego Bay (1982).', 6),
  ('14010000-0000-4000-8000-000000000407'::uuid, 'Mers et océans dans la mondialisation',
   'Quel canal relie la Méditerranée à la mer Rouge ?', 'mcq',
   '["Le canal de Suez", "Le canal de Panama", "Le détroit de Malacca", "Le détroit d''Ormuz"]', 0,
   'Le canal de Suez relie la Méditerranée à la mer Rouge : un passage stratégique majeur.', 7),
  ('14010000-0000-4000-8000-000000000408'::uuid, 'Mers et océans dans la mondialisation',
   'Quel détroit d''Asie du Sud-Est est un passage stratégique majeur ?', 'mcq',
   '["Le détroit de Malacca", "Le détroit de Gibraltar", "Le Bosphore", "Le Pas-de-Calais"]', 0,
   'Le détroit de Malacca, entre l''Indonésie et la Malaisie, est l''un des passages les plus fréquentés.', 8),
  ('14010000-0000-4000-8000-000000000409'::uuid, 'Mers et océans dans la mondialisation',
   'La convention de Montego Bay (1982) définit le droit de la mer.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La convention de Montego Bay (1982) fixe le droit de la mer, dont la ZEE.', 9),
  ('14010000-0000-4000-8000-000000000410'::uuid, 'Mers et océans dans la mondialisation',
   'Quelle mer fait l''objet de fortes tensions territoriales en Asie ?', 'mcq',
   '["La mer de Chine méridionale", "La mer Baltique", "La mer d''Irlande", "La mer des Caraïbes"]', 0,
   'La mer de Chine méridionale est disputée entre plusieurs États (ressources, routes, souveraineté).', 10),

  -- Chapitre 5 — L'Union européenne dans la mondialisation
  ('14010000-0000-4000-8000-000000000504'::uuid, 'L''Union européenne dans la mondialisation',
   'Combien d''États membres compte l''Union européenne après le Brexit ?', 'mcq',
   '["27", "15", "28", "12"]', 0,
   'Après le départ du Royaume-Uni (Brexit, 2020), l''UE compte 27 États membres.', 4),
  ('14010000-0000-4000-8000-000000000505'::uuid, 'L''Union européenne dans la mondialisation',
   'Quel traité (1992) crée l''Union européenne et prépare l''euro ?', 'mcq',
   '["Le traité de Maastricht", "Le traité de Rome", "Le traité de Lisbonne", "Le traité de Versailles"]', 0,
   'Le traité de Maastricht (1992) crée l''Union européenne et prépare la monnaie unique, l''euro.', 5),
  ('14010000-0000-4000-8000-000000000506'::uuid, 'L''Union européenne dans la mondialisation',
   'L''espace Schengen permet la libre circulation des personnes entre pays membres.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''espace Schengen supprime les contrôles aux frontières intérieures : libre circulation des personnes.', 6),
  ('14010000-0000-4000-8000-000000000507'::uuid, 'L''Union européenne dans la mondialisation',
   'Comment appelle-t-on la sortie du Royaume-Uni de l''UE (2020) ?', 'mcq',
   '["Le Brexit", "Le Grexit", "Schengen", "Le Frexit"]', 0,
   'Le Brexit désigne la sortie du Royaume-Uni de l''Union européenne, effective en 2020.', 7),
  ('14010000-0000-4000-8000-000000000508'::uuid, 'L''Union européenne dans la mondialisation',
   'La première communauté européenne, la CECA, est créée en : ', 'mcq',
   '["1951", "1992", "2007", "1973"]', 0,
   'La CECA (Communauté européenne du charbon et de l''acier) est créée en 1951.', 8),
  ('14010000-0000-4000-8000-000000000509'::uuid, 'L''Union européenne dans la mondialisation',
   'La monnaie unique de nombreux pays de l''UE est l''euro.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''euro, préparé par le traité de Maastricht, est la monnaie unique de nombreux pays de l''UE.', 9),
  ('14010000-0000-4000-8000-000000000510'::uuid, 'L''Union européenne dans la mondialisation',
   'Comment nomme-t-on la grande façade portuaire du nord-ouest européen (Rotterdam, Anvers, Hambourg) ?', 'mcq',
   '["La Northern Range", "La mégalopole asiatique", "La Sun Belt", "Le canal de Suez"]', 0,
   'La Northern Range est la grande façade portuaire du nord-ouest de l''Europe (Rotterdam, Anvers, Hambourg).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BAC — lessons.content de « Exercices types » (position 2)
--    2 exercices type bac (analyse de document / composition) corrigés par chapitre.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Démocraties fragiles et totalitarismes', $md$# Exercices types — Démocraties fragiles et totalitarismes

## Exercice 1 — Analyse de document : un discours totalitaire
Document : affiche de propagande soviétique glorifiant Staline en « guide du peuple », entouré d'ouvriers et de paysans (années 1930).

Consigne : après avoir présenté le document, montre comment il illustre les caractéristiques d'un régime totalitaire.

### Correction
**Introduction** : présenter le document (nature : affiche de propagande ; auteur : État soviétique ; date : années 1930 ; thème : culte de Staline).

**Développement**, deux idées attendues :
- **Le culte du chef** : Staline est mis en scène comme un guide bienveillant et tout-puissant, placé au centre de l'image. La propagande impose son image partout.
- **L'encadrement de la société** : la présence des ouvriers et des paysans montre la volonté d'embrigader toute la population autour du parti unique et de l'idéologie communiste.

**Conclusion** : ce document illustre deux traits majeurs du totalitarisme stalinien (culte du chef, propagande de masse), auxquels s'ajoutent la terreur et le contrôle de l'économie.

## Exercice 2 — Composition guidée
Sujet : « Les régimes totalitaires des années 1930 : points communs et différences. »

Consigne : rédige une composition organisée à partir du plan proposé.

### Correction
**Introduction** : dans les années 1930, trois régimes totalitaires (Italie fasciste, Allemagne nazie, URSS stalinienne) s'imposent. Problématique : qu'ont-ils en commun et qu'est-ce qui les distingue ?

**I. Des points communs**
- Parti unique et chef charismatique (Mussolini, Hitler, Staline).
- Propagande, encadrement de la population, terreur policière.
- Refus des libertés et de la démocratie.

**II. Des différences idéologiques**
- Le nazisme repose sur le racisme et l'antisémitisme (lois de Nuremberg, 1935).
- Le stalinisme se réclame du communisme et vise une société sans classes.
- Le fascisme italien exalte la nation et l'État.

**Conclusion** : ces régimes partagent des méthodes totalitaires mais reposent sur des idéologies différentes, ce qui pèsera dans le déclenchement de la Seconde Guerre mondiale.$md$),

    ('La Seconde Guerre mondiale', $md$# Exercices types — La Seconde Guerre mondiale

## Exercice 1 — Analyse de document : la Shoah
Document : extrait du compte rendu de la conférence de Wannsee (janvier 1942), où de hauts responsables nazis organisent la « solution finale de la question juive ».

Consigne : présente le document, puis explique en quoi il témoigne du caractère planifié du génocide des Juifs.

### Correction
**Introduction** : nature (compte rendu administratif) ; contexte (janvier 1942, guerre en cours) ; sujet (organisation de l'extermination des Juifs).

**Développement** :
- **Un génocide décidé et planifié par l'État** : la réunion rassemble de hauts responsables qui coordonnent l'extermination à l'échelle européenne.
- **Une mise en œuvre industrielle** : déportation vers des camps d'extermination (Auschwitz-Birkenau), assassinats de masse par gazage. Environ six millions de Juifs seront tués.

**Conclusion** : ce document montre que la Shoah est un crime bureaucratique et planifié, caractéristique de la « guerre d'anéantissement » menée par le régime nazi.

## Exercice 2 — Composition guidée
Sujet : « La Seconde Guerre mondiale, une guerre d'anéantissement (1939-1945). »

Consigne : rédige une composition à partir du plan proposé.

### Correction
**Introduction** : présenter le conflit (1939-1945) et la notion de guerre d'anéantissement. Problématique : pourquoi cette guerre atteint-elle un degré de violence inédit ?

**I. Une guerre totale et mondiale**
- Mobilisation de toutes les ressources des États.
- Un conflit planétaire à partir de 1941 (Barbarossa, Pearl Harbor).

**II. Une violence extrême contre les civils**
- Bombardements massifs, jusqu'aux bombes atomiques (Hiroshima, Nagasaki, 1945).
- Les génocides : Shoah (≈ 6 millions de Juifs), génocide des Tsiganes.

**Conclusion** : par l'ampleur de ses violences et de ses crimes de masse, la Seconde Guerre mondiale est bien une guerre d'anéantissement ; elle débouche sur la création de l'ONU en 1945.$md$),

    ('La Guerre froide', $md$# Exercices types — La Guerre froide

## Exercice 1 — Analyse de document : le mur de Berlin
Document : photographie du mur de Berlin (construit en 1961), séparant Berlin-Est de Berlin-Ouest.

Consigne : présente le document, puis explique en quoi le mur de Berlin est un symbole de la guerre froide.

### Correction
**Introduction** : nature (photographie) ; lieu (Berlin) ; date (à partir de 1961) ; contexte (guerre froide).

**Développement** :
- **Un symbole de la coupure du monde en deux blocs** : le mur sépare physiquement l'Est communiste de l'Ouest capitaliste, comme le « rideau de fer » sépare l'Europe.
- **Un symbole de l'opposition de deux modèles** : il empêche les Berlinois de l'Est de fuir vers l'Ouest, révélant l'échec du modèle soviétique à retenir sa population.

**Conclusion** : le mur de Berlin incarne la bipolarisation du monde ; sa chute, le 9 novembre 1989, annonce la fin de la guerre froide.

## Exercice 2 — Composition guidée
Sujet : « Le monde bipolaire pendant la guerre froide (1947-1991). »

Consigne : rédige une composition à partir du plan proposé.

### Correction
**Introduction** : définir la guerre froide (1947-1991) et l'affrontement États-Unis / URSS. Problématique : comment le monde se partage-t-il en deux blocs rivaux ?

**I. La formation de deux blocs (1947)**
- Doctrine Truman et plan Marshall à l'Ouest ; doctrine Jdanov à l'Est.
- Deux modèles opposés (démocratie libérale / communisme).

**II. Un monde sous tension**
- Crises (blocus de Berlin, mur de 1961, Cuba 1962).
- Décolonisation et émergence du Tiers-monde (Bandung, 1955).

**Conclusion** : ce monde bipolaire s'achève avec la chute du mur (1989) et la disparition de l'URSS (1991).$md$),

    ('Mers et océans dans la mondialisation', $md$# Exercices types — Mers et océans dans la mondialisation

## Exercice 1 — Analyse de document : une route maritime
Document : carte des grandes routes maritimes mondiales et des principaux passages stratégiques (canaux de Suez et de Panama, détroits de Malacca et d'Ormuz).

Consigne : présente le document, puis montre que les mers sont au cœur de la mondialisation.

### Correction
**Introduction** : nature (carte) ; sujet (routes maritimes et passages stratégiques).

**Développement** :
- **Des espaces d'échanges majeurs** : environ 80 % du commerce mondial passe par la mer ; les routes relient les grandes façades (Asie de l'Est, Europe, Amérique du Nord).
- **Des passages stratégiques** : canaux (Suez, Panama) et détroits (Malacca, Ormuz) sont des points de passage obligés dont le contrôle est un enjeu de puissance.

**Conclusion** : la carte illustre la maritimisation de l'économie mondiale et l'importance stratégique de quelques lieux de passage.

## Exercice 2 — Composition guidée
Sujet : « Mers et océans : des espaces au cœur de la mondialisation et des tensions. »

Consigne : rédige une composition à partir du plan proposé.

### Correction
**Introduction** : présenter la maritimisation et l'importance des océans. Problématique : pourquoi les mers sont-elles à la fois vitales et disputées ?

**I. Des espaces essentiels à la mondialisation**
- L'essentiel du commerce mondial (≈ 80 %) et la conteneurisation.
- Des ressources convoitées (pêche, hydrocarbures offshore, énergies).

**II. Des espaces sous tension**
- Rivalités autour des ZEE (Montego Bay, 1982) et en mer de Chine méridionale.
- Piraterie et enjeux environnementaux (pollution, surpêche).

**Conclusion** : indispensables à la mondialisation, les mers sont aussi des espaces de compétition qu'il faut protéger.$md$),

    ('L''Union européenne dans la mondialisation', $md$# Exercices types — L'Union européenne dans la mondialisation

## Exercice 1 — Analyse de document : le marché unique
Document : carte de l'Union européenne montrant les 27 États membres, la zone euro et l'espace Schengen.

Consigne : présente le document, puis montre que l'UE est une puissance intégrée mais aux contours variables.

### Correction
**Introduction** : nature (carte) ; sujet (organisation territoriale de l'UE).

**Développement** :
- **Une puissance intégrée** : 27 États membres, un marché unique, une monnaie commune (l'euro) et un espace de libre circulation (Schengen).
- **Des contours variables** : tous les pays n'ont pas l'euro ni Schengen ; le Brexit (2020) montre que l'appartenance peut être remise en cause.

**Conclusion** : la carte révèle une intégration poussée mais à géométrie variable, signe d'une puissance encore incomplète.

## Exercice 2 — Composition guidée
Sujet : « L'Union européenne, une puissance dans la mondialisation. »

Consigne : rédige une composition à partir du plan proposé.

### Correction
**Introduction** : présenter l'UE (27 membres) et sa place dans la mondialisation. Problématique : en quoi l'UE est-elle une puissance, et pourquoi reste-t-elle incomplète ?

**I. Une grande puissance**
- Un marché unique et l'une des premières puissances commerciales du monde.
- Des atouts majeurs : l'euro, la Northern Range (Rotterdam, Anvers, Hambourg).

**II. Une puissance incomplète et inégale**
- Pas de défense ni de diplomatie unifiées.
- De fortes disparités territoriales, corrigées par la politique de cohésion ; le Brexit (2020) fragilise l'ensemble.

**Conclusion** : puissance économique de premier plan, l'UE peine à s'affirmer comme puissance politique unie.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
