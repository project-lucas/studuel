-- =============================================================================
-- Studuel — Migration 131 : CONTENU Histoire-Géo 1re (cours + carte mentale + quiz)
-- Remplit les 5 chapitres d'Histoire-Géo 1re (programme officiel, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de la structure)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (positions 4→10). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant).
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons d'Histoire-Géo 1re, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('L''Europe face aux révolutions', $md$# L'Europe face aux révolutions (1789-1848)

## Ce que tu vas comprendre
Entre 1789 et 1848, l'Europe est traversée par des vagues révolutionnaires qui remettent en cause les monarchies absolues. Deux grandes idées se diffusent : le **libéralisme** (liberté, souveraineté du peuple) et le **nationalisme** (droit des peuples à former une nation).

## 1. L'héritage de la Révolution française
La **Révolution française de 1789** proclame la **Déclaration des droits de l'homme et du citoyen** : liberté, égalité, souveraineté de la nation. Ces principes se répandent en Europe, notamment grâce aux conquêtes de la période napoléonienne.

*Repère : 1789 = prise de la Bastille et Déclaration des droits de l'homme.*

## 2. Le Congrès de Vienne (1815) et la Restauration
Après la chute de **Napoléon en 1815**, les monarchies victorieuses se réunissent au **Congrès de Vienne**. Elles veulent restaurer l'ordre ancien et effacer les acquis révolutionnaires : c'est la **Restauration**. L'Europe est redessinée au profit des rois.

## 3. Le libéralisme et le nationalisme
- Le **libéralisme** réclame des libertés (presse, réunion) et des constitutions limitant le pouvoir des rois.
- Le **nationalisme** défend l'idée que chaque peuple doit avoir son État (unité italienne, unité allemande, indépendance grecque en 1830).

## 4. Les vagues révolutionnaires : 1830 et 1848
- En **1830**, une nouvelle révolution éclate en France (les Trois Glorieuses) et gagne la Belgique et la Pologne.
- En **1848**, le « **Printemps des peuples** » embrase presque toute l'Europe. En France, la **Deuxième République** est proclamée, le **suffrage universel masculin** et l'**abolition de l'esclavage** sont votés.

*Repère : 1848 = Printemps des peuples, IIe République en France.*

## L'essentiel à retenir
- La **Révolution de 1789** diffuse en Europe les idées de liberté et de nation.
- Le **Congrès de Vienne (1815)** tente de restaurer les monarchies (Restauration).
- **Libéralisme** = libertés et constitution ; **nationalisme** = un État par peuple.
- **1830** et **1848** : deux grandes vagues révolutionnaires ; 1848 = Printemps des peuples et suffrage universel masculin en France.$md$),

    ('La Troisième République', $md$# La Troisième République (1870-1914)

## Ce que tu vas comprendre
Née dans la défaite de 1870, la **Troisième République** met du temps à s'enraciner mais devient le régime qui installe durablement la démocratie en France. Elle vote de grandes lois, impose la laïcité et bâtit un vaste empire colonial.

## 1. La naissance du régime (1870)
La défaite face à la Prusse entraîne la chute de **Napoléon III** et la **proclamation de la République le 4 septembre 1870**. Les débuts sont fragiles : la **Commune de Paris (1871)** est réprimée, et les monarchistes restent puissants avant que les républicains ne l'emportent.

*Repère : 1870 = proclamation de la Troisième République.*

## 2. Les grandes lois républicaines
Les républicains fondent la démocratie par les libertés :
- **Lois scolaires de Jules Ferry (1881-1882)** : l'école primaire devient **gratuite, laïque et obligatoire**.
- **Liberté de la presse (1881)**, **liberté de réunion**, **liberté syndicale (1884)**.

## 3. La laïcité
La République sépare progressivement l'Église et l'État. La **loi de séparation des Églises et de l'État de 1905** garantit la **liberté de conscience** et rend l'État neutre en matière religieuse.

*Repère : 1905 = loi de séparation des Églises et de l'État.*

## 4. L'affaire Dreyfus et les tensions
L'**affaire Dreyfus (1894-1906)**, du nom d'un officier juif injustement condamné, divise profondément la France entre « dreyfusards » (défenseurs de la justice) et « antidreyfusards ». Elle révèle la force de l'antisémitisme mais aussi la défense des droits.

## 5. La République coloniale
La Troisième République construit le **deuxième empire colonial du monde** (Afrique, Indochine). Elle le justifie par une prétendue « mission civilisatrice », en réalité une domination et une exploitation des peuples colonisés.

## L'essentiel à retenir
- La République est proclamée en **1870**, après la défaite face à la Prusse.
- **Lois Ferry (1881-1882)** : école gratuite, laïque et obligatoire.
- **1905** : séparation des Églises et de l'État (laïcité).
- L'**affaire Dreyfus** divise la France ; la République bâtit un vaste **empire colonial**.$md$),

    ('La Grande Guerre et la fin des empires', $md$# La Grande Guerre et la fin des empires (1914-1918)

## Ce que tu vas comprendre
La Première Guerre mondiale est le premier conflit d'une violence inédite : une **guerre totale** qui mobilise des sociétés entières. Elle provoque des millions de morts, la chute de plusieurs empires et redessine la carte de l'Europe.

## 1. Une guerre totale
La **guerre totale** mobilise toutes les ressources d'un pays : les soldats au front, mais aussi l'**arrière** (usines, femmes au travail, propagande, économie). L'ensemble de la société est engagé dans l'effort de guerre.

*Repère : 1914 = début de la guerre ; 1918 = armistice le 11 novembre.*

## 2. Les grandes phases
- **1914** : guerre de mouvement puis enlisement, la guerre de **tranchées** commence.
- **1916** : les grandes batailles d'usure, comme **Verdun** et la Somme.
- **1917** : année de crises (mutineries) ; entrée en guerre des **États-Unis**.
- **1918** : offensives finales et **armistice du 11 novembre 1918**.

## 3. Une violence de masse
Les combats de tranchées, l'artillerie et les gaz font des millions de morts et de blessés. Les civils sont aussi victimes : c'est le cas du **génocide des Arméniens** perpétré par l'Empire ottoman à partir de 1915.

## 4. Les révolutions russes de 1917
En **1917**, la Russie connaît deux révolutions : celle de février renverse le tsar, celle d'**octobre** porte les **bolcheviks de Lénine** au pouvoir. La Russie sort de la guerre et devient un État communiste.

## 5. Le bilan et les traités
Le bilan est terrible : environ **10 millions de morts**. Les **traités de paix (traité de Versailles, 1919)** redessinent l'Europe : disparition des empires allemand, austro-hongrois, russe et ottoman, naissance de nouveaux États.

## L'essentiel à retenir
- La guerre de **1914-1918** est une **guerre totale** (front et arrière mobilisés).
- Grandes dates : **Verdun (1916)**, révolutions russes et entrée des USA (**1917**), **armistice du 11 novembre 1918**.
- Violences de masse : tranchées, gaz, **génocide des Arméniens**.
- **1917** : les bolcheviks prennent le pouvoir en Russie ; **1919** : traité de Versailles et fin des empires.$md$),

    ('La métropolisation', $md$# La métropolisation

## Ce que tu vas comprendre
La **métropolisation** est le processus de concentration croissante des populations, des activités et des richesses dans les grandes villes, les **métropoles**. C'est l'un des phénomènes majeurs qui organise le monde d'aujourd'hui.

## 1. Un monde de plus en plus urbain
Depuis 2007, **plus de la moitié** de l'humanité vit en ville. La croissance urbaine est très forte, surtout dans les pays en développement. Certaines agglomérations dépassent 10 millions d'habitants : ce sont les **mégapoles** (Tokyo, Delhi, Shanghai).

## 2. Qu'est-ce qu'une métropole ?
Une **métropole** est une grande ville qui **concentre les fonctions de commandement** : sièges d'entreprises, pouvoirs politiques, universités, culture, transports. Elle **rayonne** sur un vaste territoire et attire hommes, capitaux et flux.

## 3. Les métropoles mondiales
Certaines métropoles ont une influence planétaire : ce sont les **villes mondiales** comme **New York, Londres, Tokyo ou Paris**. Elles sont reliées entre elles par des réseaux (aériens, numériques, financiers) et forment l'**Archipel Métropolitain Mondial**.

## 4. Des métropoles inégales et fragmentées
La métropolisation renforce les inégalités :
- entre les métropoles (les villes mondiales dominent) ;
- **à l'intérieur** des métropoles, entre quartiers riches (centres d'affaires, quartiers sécurisés) et quartiers pauvres (**bidonvilles**). On parle de **fragmentation urbaine**.

## 5. Étalement et défis
Les métropoles **s'étalent** (périurbanisation) et posent des défis : transports, pollution, logement, gestion des déchets et développement durable.

## L'essentiel à retenir
- La **métropolisation** = concentration des hommes, activités et richesses dans les grandes villes.
- Une **métropole** concentre les **fonctions de commandement** et rayonne sur un territoire.
- Les **villes mondiales** (New York, Londres, Tokyo, Paris) dominent et sont reliées en réseaux.
- La métropolisation crée des **inégalités** et une **fragmentation** entre quartiers riches et pauvres.$md$),

    ('Les espaces productifs français', $md$# Les espaces productifs français

## Ce que tu vas comprendre
Un **espace productif** est un territoire aménagé pour produire des biens ou des services. En France, ces espaces sont variés (agricoles, industriels, de services) et connaissent de profondes transformations liées à la mondialisation.

## 1. Qu'est-ce qu'un espace productif ?
Un **espace productif** est un lieu où l'on produit de la richesse. On distingue trois grands secteurs : l'**agriculture** (primaire), l'**industrie** (secondaire) et les **services** (tertiaire), aujourd'hui largement dominants.

## 2. Les espaces agricoles
L'agriculture française est l'une des premières d'Europe. Elle est très **productive** et **modernisée** (mécanisation, engrais). Elle est aussi **diverse** : grandes cultures céréalières (Bassin parisien), viticulture, élevage. Elle s'adapte à de nouvelles demandes (**agriculture biologique**, circuits courts).

## 3. Les espaces industriels
L'industrie s'est transformée : les anciennes régions minières (Nord, Lorraine) ont connu la **désindustrialisation**, tandis que de nouveaux pôles se développent, souvent liés aux **hautes technologies** (aéronautique à **Toulouse**, technopôles du Sud).

## 4. Les espaces de services
Les **services** (tertiaire) emploient aujourd'hui la majorité des actifs. Ils se concentrent dans les **métropoles** et sur le littoral. Le **tourisme** est un secteur clé : la France est la **première destination touristique mondiale** (littoraux, montagnes, patrimoine).

## 5. Des dynamiques inégales
Les espaces productifs sont inégalement dynamiques : les **métropoles**, les **littoraux** et les **régions frontalières** attirent les activités, tandis que certains espaces ruraux et industriels anciens sont en difficulté.

## L'essentiel à retenir
- Un **espace productif** est un territoire aménagé pour produire biens ou services.
- L'**agriculture** française est productive et diverse ; l'**industrie** se recompose (désindustrialisation puis hautes technologies).
- Les **services** dominent et se concentrent dans les métropoles ; la France est la 1re destination touristique mondiale.
- Les dynamiques sont **inégales** : métropoles et littoraux gagnants, espaces ruraux et industriels anciens fragilisés.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('L''Europe face aux révolutions', $json${
      "centre": "L'Europe face aux révolutions (1789-1848)",
      "branches": [
        { "titre": "Héritage de 1789", "enfants": ["Déclaration des droits de l'homme", "Liberté, égalité, nation", "Diffusion en Europe"] },
        { "titre": "Congrès de Vienne (1815)", "enfants": ["Chute de Napoléon", "Restauration des monarchies", "Retour de l'ordre ancien"] },
        { "titre": "Idées nouvelles", "enfants": ["Libéralisme = libertés", "Nationalisme = un État par peuple", "Constitutions"] },
        { "titre": "Vagues révolutionnaires", "enfants": ["1830 : Trois Glorieuses", "1848 : Printemps des peuples", "IIe République et suffrage universel"] }
      ]
    }$json$),
    ('La Troisième République', $json${
      "centre": "La Troisième République (1870-1914)",
      "branches": [
        { "titre": "Naissance (1870)", "enfants": ["Défaite face à la Prusse", "Proclamation le 4 sept. 1870", "Commune de Paris (1871)"] },
        { "titre": "Grandes lois", "enfants": ["Lois Ferry 1881-1882", "École gratuite, laïque, obligatoire", "Liberté de presse (1881)"] },
        { "titre": "Laïcité", "enfants": ["Séparation Églises/État (1905)", "Liberté de conscience", "État neutre"] },
        { "titre": "Tensions et colonies", "enfants": ["Affaire Dreyfus (1894-1906)", "Deuxième empire colonial", "Mission civilisatrice contestée"] }
      ]
    }$json$),
    ('La Grande Guerre et la fin des empires', $json${
      "centre": "La Grande Guerre (1914-1918)",
      "branches": [
        { "titre": "Une guerre totale", "enfants": ["Front et arrière mobilisés", "Usines, femmes, propagande", "1914 début, 1918 armistice"] },
        { "titre": "Grandes phases", "enfants": ["Guerre de tranchées", "Verdun (1916)", "USA en 1917, 11 nov. 1918"] },
        { "titre": "Violence de masse", "enfants": ["Tranchées, gaz, artillerie", "Génocide des Arméniens (1915)", "~10 millions de morts"] },
        { "titre": "Révolutions et traités", "enfants": ["Révolutions russes 1917", "Bolcheviks de Lénine", "Traité de Versailles 1919"] }
      ]
    }$json$),
    ('La métropolisation', $json${
      "centre": "La métropolisation",
      "branches": [
        { "titre": "Un monde urbain", "enfants": ["Plus de la moitié en ville", "Mégapoles > 10 millions", "Tokyo, Delhi, Shanghai"] },
        { "titre": "La métropole", "enfants": ["Fonctions de commandement", "Sièges, pouvoirs, culture", "Rayonne sur un territoire"] },
        { "titre": "Villes mondiales", "enfants": ["New York, Londres, Tokyo, Paris", "Reliées en réseaux", "Archipel métropolitain mondial"] },
        { "titre": "Inégalités", "enfants": ["Fragmentation urbaine", "Quartiers riches / bidonvilles", "Étalement et défis"] }
      ]
    }$json$),
    ('Les espaces productifs français', $json${
      "centre": "Les espaces productifs français",
      "branches": [
        { "titre": "Définition", "enfants": ["Territoire pour produire", "Primaire, secondaire, tertiaire", "Transformés par la mondialisation"] },
        { "titre": "Agriculture", "enfants": ["Productive et modernisée", "Céréales, vigne, élevage", "Bio et circuits courts"] },
        { "titre": "Industrie", "enfants": ["Désindustrialisation (Nord, Lorraine)", "Hautes technologies", "Aéronautique à Toulouse"] },
        { "titre": "Services et dynamiques", "enfants": ["Tertiaire majoritaire", "1re destination touristique", "Métropoles et littoraux gagnants"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
 WHERE c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (Ne fait rien si un quiz existe déjà — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Histoire-Géo', '1re', v.chapter, true, l.id
FROM (VALUES
  ('13119999-0000-4000-8000-000000000001'::uuid, 'L''Europe face aux révolutions'),
  ('13119999-0000-4000-8000-000000000002'::uuid, 'La Troisième République'),
  ('13119999-0000-4000-8000-000000000003'::uuid, 'La Grande Guerre et la fin des empires'),
  ('13119999-0000-4000-8000-000000000004'::uuid, 'La métropolisation'),
  ('13119999-0000-4000-8000-000000000005'::uuid, 'Les espaces productifs français')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
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
  -- Chapitre 1 — L'Europe face aux révolutions
  ('13110000-0000-4000-8000-000000000104'::uuid, 'L''Europe face aux révolutions',
   'En quelle année la Révolution française éclate-t-elle avec la prise de la Bastille ?', 'mcq',
   '["1789", "1815", "1830", "1848"]', 0,
   'La prise de la Bastille et la Déclaration des droits de l''homme datent de 1789.', 4),
  ('13110000-0000-4000-8000-000000000105'::uuid, 'L''Europe face aux révolutions',
   'Que cherchent à faire les monarchies au Congrès de Vienne en 1815 ?', 'mcq',
   '["Restaurer l''ordre monarchique d''avant la Révolution", "Proclamer la République en Europe", "Créer l''Union européenne", "Abolir toutes les monarchies"]', 0,
   'Après la chute de Napoléon, le Congrès de Vienne (1815) veut restaurer les monarchies : c''est la Restauration.', 5),
  ('13110000-0000-4000-8000-000000000106'::uuid, 'L''Europe face aux révolutions',
   'Le nationalisme défend l''idée que chaque peuple doit avoir son propre État.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le nationalisme réclame qu''à chaque nation corresponde un État (unité italienne, unité allemande…).', 6),
  ('13110000-0000-4000-8000-000000000107'::uuid, 'L''Europe face aux révolutions',
   'Comment appelle-t-on la vague révolutionnaire de 1848 en Europe ?', 'mcq',
   '["Le Printemps des peuples", "La Terreur", "La Restauration", "La Belle Époque"]', 0,
   '1848 est appelé le « Printemps des peuples » : les révolutions se propagent dans presque toute l''Europe.', 7),
  ('13110000-0000-4000-8000-000000000108'::uuid, 'L''Europe face aux révolutions',
   'Que réclament les libéraux au début du XIXe siècle ?', 'mcq',
   '["Des libertés et une constitution limitant le pouvoir du roi", "Le retour de la monarchie absolue", "La suppression du Parlement", "L''interdiction de la presse"]', 0,
   'Le libéralisme réclame les libertés (presse, réunion) et une constitution qui limite le pouvoir du roi.', 8),
  ('13110000-0000-4000-8000-000000000109'::uuid, 'L''Europe face aux révolutions',
   'En 1848, la France proclame la Deuxième République et vote le suffrage universel masculin.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En 1848, la IIe République instaure le suffrage universel masculin et abolit l''esclavage.', 9),
  ('13110000-0000-4000-8000-000000000110'::uuid, 'L''Europe face aux révolutions',
   'Quel texte de 1789 proclame la liberté et l''égalité des citoyens ?', 'mcq',
   '["La Déclaration des droits de l''homme et du citoyen", "Le Code civil", "L''Édit de Nantes", "La Charte de 1814"]', 0,
   'La Déclaration des droits de l''homme et du citoyen (1789) proclame liberté, égalité et souveraineté de la nation.', 10),

  -- Chapitre 2 — La Troisième République
  ('13110000-0000-4000-8000-000000000204'::uuid, 'La Troisième République',
   'En quelle année la Troisième République est-elle proclamée ?', 'mcq',
   '["1870", "1789", "1848", "1905"]', 0,
   'La République est proclamée le 4 septembre 1870, après la défaite face à la Prusse.', 4),
  ('13110000-0000-4000-8000-000000000205'::uuid, 'La Troisième République',
   'Que rendent obligatoire les lois de Jules Ferry (1881-1882) ?', 'mcq',
   '["L''école primaire, gratuite et laïque", "Le service militaire de 5 ans", "La messe du dimanche", "Le vote des femmes"]', 0,
   'Les lois Ferry rendent l''école primaire gratuite, laïque et obligatoire.', 5),
  ('13110000-0000-4000-8000-000000000206'::uuid, 'La Troisième République',
   'Quelle loi de 1905 fonde la laïcité en France ?', 'mcq',
   '["La loi de séparation des Églises et de l''État", "La loi Ferry", "La loi Le Chapelier", "La loi Veil"]', 0,
   'La loi de 1905 sépare les Églises et l''État et garantit la liberté de conscience.', 6),
  ('13110000-0000-4000-8000-000000000207'::uuid, 'La Troisième République',
   'L''affaire Dreyfus a profondément divisé la société française.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''affaire Dreyfus (1894-1906) oppose dreyfusards et antidreyfusards et divise la France.', 7),
  ('13110000-0000-4000-8000-000000000208'::uuid, 'La Troisième République',
   'La Troisième République a construit le deuxième empire colonial du monde.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La France de la IIIe République bâtit un vaste empire colonial (Afrique, Indochine), le deuxième du monde.', 8),
  ('13110000-0000-4000-8000-000000000209'::uuid, 'La Troisième République',
   'Quel événement de 1871 est réprimé au début de la Troisième République ?', 'mcq',
   '["La Commune de Paris", "La prise de la Bastille", "Le coup d''État de Napoléon III", "La Saint-Barthélemy"]', 0,
   'La Commune de Paris (1871) est un soulèvement parisien durement réprimé.', 9),
  ('13110000-0000-4000-8000-000000000210'::uuid, 'La Troisième République',
   'La liberté de la presse est instaurée en France en 1881.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La loi de 1881 garantit la liberté de la presse, l''une des grandes libertés républicaines.', 10),

  -- Chapitre 3 — La Grande Guerre et la fin des empires
  ('13110000-0000-4000-8000-000000000304'::uuid, 'La Grande Guerre et la fin des empires',
   'Combien de temps dure la Première Guerre mondiale ?', 'mcq',
   '["De 1914 à 1918", "De 1870 à 1871", "De 1939 à 1945", "De 1905 à 1918"]', 0,
   'La Grande Guerre se déroule de 1914 à 1918 (armistice le 11 novembre 1918).', 4),
  ('13110000-0000-4000-8000-000000000305'::uuid, 'La Grande Guerre et la fin des empires',
   'Qu''est-ce qu''une guerre totale ?', 'mcq',
   '["Une guerre qui mobilise toute la société, le front et l''arrière", "Une guerre limitée à quelques soldats", "Une guerre uniquement navale", "Une guerre sans armes"]', 0,
   'La guerre totale mobilise l''ensemble des ressources d''un pays : soldats au front et arrière (usines, propagande…).', 5),
  ('13110000-0000-4000-8000-000000000306'::uuid, 'La Grande Guerre et la fin des empires',
   'Quelle grande bataille de 1916 est un symbole de la Première Guerre mondiale ?', 'mcq',
   '["Verdun", "Austerlitz", "Waterloo", "Stalingrad"]', 0,
   'La bataille de Verdun (1916) est l''une des plus meurtrières de la guerre.', 6),
  ('13110000-0000-4000-8000-000000000307'::uuid, 'La Grande Guerre et la fin des empires',
   'En 1917, les bolcheviks de Lénine prennent le pouvoir en Russie.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La révolution d''octobre 1917 porte les bolcheviks de Lénine au pouvoir ; la Russie devient communiste.', 7),
  ('13110000-0000-4000-8000-000000000308'::uuid, 'La Grande Guerre et la fin des empires',
   'À quelle date est signé l''armistice qui met fin aux combats ?', 'mcq',
   '["Le 11 novembre 1918", "Le 14 juillet 1918", "Le 8 mai 1918", "Le 1er septembre 1918"]', 0,
   'L''armistice est signé le 11 novembre 1918, mettant fin aux combats.', 8),
  ('13110000-0000-4000-8000-000000000309'::uuid, 'La Grande Guerre et la fin des empires',
   'Quel traité de 1919 réorganise l''Europe après la guerre ?', 'mcq',
   '["Le traité de Versailles", "Le traité de Rome", "Le traité de Vienne", "Le traité de Maastricht"]', 0,
   'Le traité de Versailles (1919) impose la paix et redessine l''Europe (fin des empires).', 9),
  ('13110000-0000-4000-8000-000000000310'::uuid, 'La Grande Guerre et la fin des empires',
   'La Première Guerre mondiale a fait environ 10 millions de morts.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le bilan humain est terrible : environ 10 millions de morts, sans compter les blessés.', 10),

  -- Chapitre 4 — La métropolisation
  ('13110000-0000-4000-8000-000000000404'::uuid, 'La métropolisation',
   'Qu''est-ce que la métropolisation ?', 'mcq',
   '["La concentration des hommes, activités et richesses dans les grandes villes", "L''abandon des villes pour la campagne", "La destruction des métros", "La baisse de la population mondiale"]', 0,
   'La métropolisation est la concentration croissante des populations, activités et richesses dans les métropoles.', 4),
  ('13110000-0000-4000-8000-000000000405'::uuid, 'La métropolisation',
   'Que concentre une métropole ?', 'mcq',
   '["Les fonctions de commandement (économie, pouvoir, culture)", "Uniquement des exploitations agricoles", "Aucune activité", "Seulement des logements"]', 0,
   'Une métropole concentre les fonctions de commandement et rayonne sur un vaste territoire.', 5),
  ('13110000-0000-4000-8000-000000000406'::uuid, 'La métropolisation',
   'Depuis 2007, plus de la moitié de l''humanité vit en ville.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Depuis 2007, plus de la moitié de la population mondiale est urbaine.', 6),
  ('13110000-0000-4000-8000-000000000407'::uuid, 'La métropolisation',
   'Lequel de ces exemples est une « ville mondiale » à rayonnement planétaire ?', 'mcq',
   '["New York", "Un village de 500 habitants", "Une station de ski isolée", "Une exploitation agricole"]', 0,
   'New York, Londres, Tokyo ou Paris sont des villes mondiales au rayonnement planétaire.', 7),
  ('13110000-0000-4000-8000-000000000408'::uuid, 'La métropolisation',
   'Comment appelle-t-on une agglomération de plus de 10 millions d''habitants ?', 'mcq',
   '["Une mégapole", "Un hameau", "Une bourgade", "Un canton"]', 0,
   'Une mégapole est une très grande agglomération de plus de 10 millions d''habitants (Tokyo, Delhi…).', 8),
  ('13110000-0000-4000-8000-000000000409'::uuid, 'La métropolisation',
   'La métropolisation réduit toujours les inégalités entre quartiers.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la métropolisation accentue souvent les inégalités et crée une fragmentation entre quartiers riches et pauvres.', 9),
  ('13110000-0000-4000-8000-000000000410'::uuid, 'La métropolisation',
   'Comment nomme-t-on la division d''une métropole entre quartiers riches et quartiers pauvres ?', 'mcq',
   '["La fragmentation urbaine", "La désertification", "La reforestation", "La déprise agricole"]', 0,
   'La fragmentation urbaine désigne la séparation entre quartiers riches sécurisés et quartiers pauvres (bidonvilles).', 10),

  -- Chapitre 5 — Les espaces productifs français
  ('13110000-0000-4000-8000-000000000504'::uuid, 'Les espaces productifs français',
   'Qu''est-ce qu''un espace productif ?', 'mcq',
   '["Un territoire aménagé pour produire des biens ou des services", "Une zone naturelle protégée sans activité", "Un désert inhabité", "Un simple lieu de résidence"]', 0,
   'Un espace productif est un territoire aménagé pour produire de la richesse (agriculture, industrie, services).', 4),
  ('13110000-0000-4000-8000-000000000505'::uuid, 'Les espaces productifs français',
   'Quel secteur emploie aujourd''hui la majorité des actifs en France ?', 'mcq',
   '["Les services (tertiaire)", "L''agriculture (primaire)", "L''industrie (secondaire)", "La pêche"]', 0,
   'Le secteur des services (tertiaire) est aujourd''hui largement dominant en France.', 5),
  ('13110000-0000-4000-8000-000000000506'::uuid, 'Les espaces productifs français',
   'La France est la première destination touristique mondiale.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La France est la première destination touristique mondiale (littoraux, montagnes, patrimoine).', 6),
  ('13110000-0000-4000-8000-000000000507'::uuid, 'Les espaces productifs français',
   'Quelle ville est un grand pôle de l''industrie aéronautique française ?', 'mcq',
   '["Toulouse", "Lille", "Brest", "Strasbourg"]', 0,
   'Toulouse est le grand pôle de l''industrie aéronautique (Airbus).', 7),
  ('13110000-0000-4000-8000-000000000508'::uuid, 'Les espaces productifs français',
   'Comment appelle-t-on le déclin des anciennes régions industrielles comme le Nord ou la Lorraine ?', 'mcq',
   '["La désindustrialisation", "La métropolisation", "La périurbanisation", "La reconquête"]', 0,
   'La désindustrialisation est le déclin des vieilles régions industrielles (mines, sidérurgie).', 8),
  ('13110000-0000-4000-8000-000000000509'::uuid, 'Les espaces productifs français',
   'L''agriculture française est peu productive et peu modernisée.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : l''agriculture française est au contraire très productive et modernisée (mécanisation, engrais).', 9),
  ('13110000-0000-4000-8000-000000000510'::uuid, 'Les espaces productifs français',
   'Quels espaces sont les plus dynamiques pour les activités productives ?', 'mcq',
   '["Les métropoles et les littoraux", "Uniquement les zones de montagne isolées", "Les régions désindustrialisées en crise", "Les campagnes en déprise"]', 0,
   'Les métropoles, les littoraux et les régions frontalières concentrent et attirent les activités.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
