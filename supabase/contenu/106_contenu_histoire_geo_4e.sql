-- =============================================================================
-- Studuel — Migration 106 : CONTENU Histoire-Géo 4e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres d'Histoire-Géo 4e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder existant)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (3 → 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons Histoire-Géo 4e, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('L''Europe des Lumières', $md$# L'Europe des Lumières

## Ce que tu vas comprendre
Au **XVIIIe siècle**, un mouvement d'idées appelé les **Lumières** traverse l'Europe. Des penseurs, les **philosophes**, remettent en cause l'ordre établi (monarchie absolue, privilèges, intolérance religieuse) au nom de la **raison**, de la **liberté** et de l'**égalité**. Ce chapitre t'explique leurs idées et comment elles se sont diffusées.

## 1. Le siècle des Lumières
Les Lumières désignent la volonté d'**éclairer** les esprits par la **raison** plutôt que par les croyances et les traditions. Les philosophes veulent combattre l'**ignorance**, le **fanatisme** et l'**arbitraire** du pouvoir.

*Le mouvement naît surtout en **France** et en **Angleterre**, puis rayonne dans toute l'Europe.*

## 2. Les grands philosophes et leurs idées
- **Voltaire** (1694-1778) combat l'**intolérance religieuse** et défend la **liberté d'expression**.
- **Montesquieu** (1689-1755), dans *De l'esprit des lois* (1748), propose la **séparation des pouvoirs** (exécutif, législatif, judiciaire) pour éviter le despotisme.
- **Rousseau** (1712-1778), dans *Du contrat social* (1762), affirme que la **souveraineté** appartient au **peuple**.
- **Diderot** et **d'Alembert** dirigent l'**Encyclopédie**.

## 3. L'Encyclopédie
Publiée de **1751 à 1772**, l'**Encyclopédie** rassemble en 28 volumes tout le **savoir** de l'époque. Elle diffuse les idées nouvelles et l'esprit critique. C'est une arme contre l'obscurantisme.

## 4. La diffusion des idées
Les idées circulent dans les **salons** (tenus souvent par des femmes), les **cafés**, les **académies** et par les **livres**, malgré la **censure** royale. Certains souverains, dits « **despotes éclairés** » (comme Frédéric II de Prusse), s'en inspirent.

## 5. Un héritage majeur
Les Lumières préparent les **révolutions** de la fin du siècle. Leurs idées (liberté, égalité, tolérance, droits de l'homme) inspireront la **Révolution française** de 1789.

## L'essentiel à retenir
- Les **Lumières** (XVIIIe siècle) défendent la **raison**, la **liberté** et la **tolérance**.
- **Voltaire** (tolérance), **Montesquieu** (séparation des pouvoirs), **Rousseau** (souveraineté du peuple).
- L'**Encyclopédie** (1751-1772) de Diderot et d'Alembert diffuse le savoir.
- Les idées circulent dans les **salons** et les livres, malgré la **censure**, et préparent 1789.$md$),

    ('La Révolution française et l''Empire', $md$# La Révolution française et l'Empire

## Ce que tu vas comprendre
En **1789**, la France bascule : la **monarchie absolue** s'effondre et une société nouvelle, fondée sur la **liberté** et l'**égalité**, se met en place. Ce chapitre suit les grandes étapes, de la prise de la Bastille à l'Empire de Napoléon.

## 1. La crise de 1789
Le royaume est en **crise financière** et l'**Ancien Régime** repose sur des **privilèges** injustes (noblesse, clergé). Louis XVI convoque les **États généraux** en mai 1789. Le **Tiers État** se proclame **Assemblée nationale**.

## 2. 1789 : l'année de la rupture
- **14 juillet 1789** : prise de la **Bastille**, symbole de la fin de l'arbitraire royal.
- **Nuit du 4 août 1789** : abolition des **privilèges**.
- **26 août 1789** : **Déclaration des droits de l'homme et du citoyen (DDHC)**, qui affirme la liberté, l'égalité et la souveraineté de la nation.

## 3. De la monarchie constitutionnelle à la République
La **Constitution de 1791** instaure une **monarchie constitutionnelle** : le roi partage le pouvoir. Mais la fuite du roi rompt la confiance. Le **22 septembre 1792**, la **République** est proclamée. **Louis XVI est guillotiné en janvier 1793**.

## 4. La Terreur et la fin de la Révolution
Menacée par les guerres et les révoltes, la République connaît la **Terreur** (1793-1794), dirigée par **Robespierre**. Après sa chute, un régime plus modéré, le **Directoire**, gouverne.

## 5. Napoléon Bonaparte
En **1799**, le général **Napoléon Bonaparte** prend le pouvoir par un coup d'État. Il se fait **sacrer empereur en 1804**. Il réorganise la France (**Code civil** de 1804, préfets, lycées, franc) et étend son empire par la guerre en Europe, avant sa chute en **1815** (Waterloo).

## L'essentiel à retenir
- **1789** : États généraux, prise de la **Bastille** (14 juillet), abolition des privilèges, **DDHC** (26 août).
- **1792** : proclamation de la **République** ; Louis XVI guillotiné en 1793.
- La **Terreur** (Robespierre) puis le Directoire.
- **Napoléon** : empereur en **1804**, **Code civil**, chute en 1815.$md$),

    ('L''Europe de la révolution industrielle', $md$# L'Europe de la révolution industrielle

## Ce que tu vas comprendre
Au **XIXe siècle**, l'Europe connaît une transformation profonde : la **révolution industrielle**. De nouvelles machines, de nouvelles énergies et de nouvelles usines bouleversent le travail, la société et les paysages. Ce chapitre t'en explique les mécanismes et les conséquences.

## 1. Les progrès techniques
Le point de départ est la **machine à vapeur** (perfectionnée par **James Watt**), qui utilise le **charbon** comme énergie. Elle fait tourner les machines des **usines** et propulse les **trains** (chemin de fer) et les bateaux à vapeur.

*Ces innovations démarrent au **Royaume-Uni** à la fin du XVIIIe siècle, puis gagnent la France, l'Allemagne…*

## 2. L'usine et la production de masse
Le travail quitte l'atelier artisanal pour l'**usine**. On y produit en grande quantité (textile, acier) grâce aux **machines** et à la division du travail. Les **villes industrielles** grandissent très vite.

## 3. Le capitalisme industriel
Ce nouveau système économique, le **capitalisme**, repose sur l'**investissement** de capitaux par des **entrepreneurs** pour faire du **profit**. Les **banques** et la **Bourse** financent les usines et les chemins de fer.

## 4. Une nouvelle société
Deux grandes classes sociales s'affirment :
- la **bourgeoisie** (patrons, banquiers, commerçants), riche et puissante ;
- les **ouvriers** (le prolétariat), qui travaillent en usine dans des conditions **très dures** (longues journées, bas salaires, travail des enfants).

## 5. La question sociale
Face à la misère ouvrière naissent des idées nouvelles : le **socialisme** et le **syndicalisme**, qui défendent les droits des travailleurs. Peu à peu apparaissent des lois sociales (limitation du travail des enfants).

## L'essentiel à retenir
- La **machine à vapeur** (charbon) et le **chemin de fer** lancent la révolution industrielle, née au **Royaume-Uni**.
- L'**usine** remplace l'atelier : production de masse.
- Le **capitalisme** : entrepreneurs, banques et Bourse investissent pour le profit.
- Une société nouvelle : la **bourgeoisie** riche face aux **ouvriers** exploités → naissance du socialisme.$md$),

    ('L''urbanisation du monde', $md$# L'urbanisation du monde

## Ce que tu vas comprendre
Aujourd'hui, plus de la **moitié de l'humanité** vit en ville, et cette part ne cesse d'augmenter : c'est l'**urbanisation**. Ce chapitre de géographie t'explique comment le monde devient urbain et comment les grandes villes concentrent hommes, richesses et pouvoirs.

## 1. Un monde de plus en plus urbain
L'**urbanisation** est l'augmentation de la part de la population vivant en ville. Depuis **2007**, plus d'un humain sur deux est un citadin. Cette croissance est particulièrement rapide dans les pays des **Suds** (Afrique, Asie).

## 2. La métropolisation
La **métropolisation** est la concentration des populations, des activités et des richesses dans les grandes villes, les **métropoles**. Ces villes concentrent les **fonctions de commandement** : sièges d'entreprises, universités, aéroports, pouvoirs politiques.

*Exemples de très grandes métropoles : **Tokyo**, **New York**, **Shanghai**, **Paris**.*

## 3. Les villes mondiales
Au sommet, quelques **villes mondiales** (ou « villes globales ») commandent l'**économie mondiale** grâce à leurs Bourses, leurs multinationales et leurs connexions. Elles sont reliées entre elles par des flux (avions, internet, marchandises).

## 4. Des paysages urbains contrastés
Dans une même métropole coexistent :
- des **quartiers d'affaires** modernes (gratte-ciel, CBD) ;
- des quartiers résidentiels aisés ;
- et parfois d'immenses **bidonvilles** (quartiers pauvres et précaires), surtout dans les pays des Suds.

## 5. Les défis des villes
La croissance urbaine pose de nombreux défis : **transports**, **logement**, **pollution**, **étalement urbain**. Les villes cherchent à devenir plus **durables** (villes vertes, transports en commun).

## L'essentiel à retenir
- L'**urbanisation** : depuis **2007**, plus de la moitié de l'humanité vit en ville.
- La **métropolisation** concentre populations, richesses et **fonctions de commandement** dans les métropoles.
- Les **villes mondiales** (Tokyo, New York…) dirigent l'économie mondiale.
- Contrastes forts : **quartiers d'affaires** face aux **bidonvilles** ; défis de transport, logement et pollution.$md$),

    ('Les mobilités humaines', $md$# Les mobilités humaines

## Ce que tu vas comprendre
Jamais autant d'humains n'ont autant circulé qu'aujourd'hui : ce sont les **mobilités humaines**. Migrations pour vivre ailleurs, voyages touristiques… Ce chapitre de géographie t'explique qui se déplace, pourquoi et vers où.

## 1. Qu'est-ce qu'une mobilité ?
Une **mobilité** est un déplacement de personnes dans l'espace. On distingue les mobilités **définitives** (les **migrations**, pour s'installer ailleurs) et les mobilités **temporaires** (le **tourisme**, les études, le travail).

## 2. Les migrations internationales
Un **migrant** est une personne qui quitte son pays pour vivre dans un autre. On parle d'**émigration** (quitter son pays) et d'**immigration** (arriver dans un pays).

Les causes sont surtout :
- **économiques** (chercher du travail, une vie meilleure) : ce sont les migrations les plus nombreuses ;
- **politiques** (fuir une guerre, une persécution) : ce sont les **réfugiés**.

*Les grands flux vont surtout des pays **pauvres (Suds)** vers les pays **riches (Nords)**.*

## 3. Des trajets parfois dangereux
Certaines migrations se font dans des conditions dramatiques, comme les traversées de la **mer Méditerranée**. Les pays d'arrivée mettent en place des **politiques migratoires** (frontières, contrôles) parfois très strictes.

## 4. Le tourisme international
Le **tourisme** est la première mobilité du monde par le nombre. Un **touriste** voyage pour ses loisirs. La **France** est le pays le plus visité au monde. Les flux touristiques vont souvent des pays riches vers des destinations ensoleillées ou patrimoniales.

## 5. Les effets des mobilités
Les mobilités transforment les territoires : elles apportent des **richesses** (le tourisme fait vivre des régions) mais posent aussi des **défis** (accueil des migrants, pression sur l'environnement des lieux touristiques).

## L'essentiel à retenir
- Une **mobilité** est un déplacement ; on distingue **migrations** (définitives) et **tourisme** (temporaire).
- **Émigrer** = quitter son pays ; **immigrer** = arriver dans un pays.
- Causes des migrations : **économiques** (travail) surtout, et **politiques** (réfugiés) ; les flux vont des **Suds** vers les **Nords**.
- Le **tourisme** est la première mobilité mondiale ; la **France** est le pays le plus visité.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('L''Europe des Lumières', $json${
      "centre": "L'Europe des Lumières",
      "branches": [
        { "titre": "Le siècle des Lumières", "enfants": ["XVIIIe siècle", "Éclairer par la raison", "Contre l'ignorance et le fanatisme"] },
        { "titre": "Les philosophes", "enfants": ["Voltaire : tolérance", "Montesquieu : séparation des pouvoirs", "Rousseau : souveraineté du peuple"] },
        { "titre": "L'Encyclopédie", "enfants": ["Diderot et d'Alembert", "1751-1772, 28 volumes", "Diffuser tout le savoir"] },
        { "titre": "Diffusion et héritage", "enfants": ["Salons, cafés, livres", "Malgré la censure", "Prépare la Révolution de 1789"] }
      ]
    }$json$),
    ('La Révolution française et l''Empire', $json${
      "centre": "Révolution française et Empire",
      "branches": [
        { "titre": "La crise de 1789", "enfants": ["Crise financière", "Privilèges de l'Ancien Régime", "États généraux → Assemblée nationale"] },
        { "titre": "1789, la rupture", "enfants": ["14 juillet : prise de la Bastille", "Nuit du 4 août : fin des privilèges", "26 août : DDHC"] },
        { "titre": "Vers la République", "enfants": ["1792 : la République", "Louis XVI guillotiné (1793)", "La Terreur (Robespierre)"] },
        { "titre": "Napoléon", "enfants": ["Empereur en 1804", "Code civil (1804)", "Chute en 1815 (Waterloo)"] }
      ]
    }$json$),
    ('L''Europe de la révolution industrielle', $json${
      "centre": "La révolution industrielle",
      "branches": [
        { "titre": "Les techniques", "enfants": ["Machine à vapeur (Watt)", "Le charbon comme énergie", "Chemin de fer, trains"] },
        { "titre": "L'usine", "enfants": ["Remplace l'atelier", "Production de masse", "Villes industrielles"] },
        { "titre": "Le capitalisme", "enfants": ["Entrepreneurs et profit", "Banques et Bourse", "Investir des capitaux"] },
        { "titre": "Une société nouvelle", "enfants": ["Bourgeoisie riche", "Ouvriers exploités", "Naissance du socialisme"] }
      ]
    }$json$),
    ('L''urbanisation du monde', $json${
      "centre": "L'urbanisation du monde",
      "branches": [
        { "titre": "Un monde urbain", "enfants": ["Depuis 2007, 1 humain sur 2 en ville", "Croissance rapide dans les Suds", "Citadins de plus en plus nombreux"] },
        { "titre": "La métropolisation", "enfants": ["Concentration dans les métropoles", "Richesses et populations", "Fonctions de commandement"] },
        { "titre": "Les villes mondiales", "enfants": ["Tokyo, New York, Shanghai", "Commandent l'économie", "Reliées par des flux"] },
        { "titre": "Contrastes et défis", "enfants": ["Quartiers d'affaires (CBD)", "Bidonvilles", "Transport, logement, pollution"] }
      ]
    }$json$),
    ('Les mobilités humaines', $json${
      "centre": "Les mobilités humaines",
      "branches": [
        { "titre": "Qu'est-ce qu'une mobilité ?", "enfants": ["Déplacement de personnes", "Migrations = définitives", "Tourisme = temporaire"] },
        { "titre": "Les migrations", "enfants": ["Émigrer = quitter son pays", "Immigrer = arriver", "Causes économiques et politiques"] },
        { "titre": "Des flux Sud → Nord", "enfants": ["Chercher du travail", "Réfugiés fuyant la guerre", "Traversées dangereuses"] },
        { "titre": "Le tourisme", "enfants": ["1re mobilité mondiale", "La France, pays le plus visité", "Richesses mais pression"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
 WHERE c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz 4e ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Histoire-Géo', '4e', v.chapter, true, l.id
FROM (VALUES
  ('10619999-0000-4000-8000-000000000001'::uuid, 'L''Europe des Lumières'),
  ('10619999-0000-4000-8000-000000000002'::uuid, 'La Révolution française et l''Empire'),
  ('10619999-0000-4000-8000-000000000003'::uuid, 'L''Europe de la révolution industrielle'),
  ('10619999-0000-4000-8000-000000000004'::uuid, 'L''urbanisation du monde'),
  ('10619999-0000-4000-8000-000000000005'::uuid, 'Les mobilités humaines')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
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
  -- Chapitre 1 — L'Europe des Lumières
  ('10610000-0000-4000-8000-000000000104'::uuid, 'L''Europe des Lumières',
   'À quel siècle se développe le mouvement des Lumières ?', 'mcq',
   '["Le XVIIIe siècle", "Le XVe siècle", "Le XXe siècle", "Le XIe siècle"]', 0,
   'Les Lumières sont un mouvement d''idées du XVIIIe siècle.', 4),
  ('10610000-0000-4000-8000-000000000105'::uuid, 'L''Europe des Lumières',
   'Quel philosophe a proposé la séparation des pouvoirs ?', 'mcq',
   '["Montesquieu", "Voltaire", "Rousseau", "Diderot"]', 0,
   'Montesquieu, dans « De l''esprit des lois » (1748), propose la séparation des pouvoirs.', 5),
  ('10610000-0000-4000-8000-000000000106'::uuid, 'L''Europe des Lumières',
   'Quel penseur est surtout connu pour son combat en faveur de la tolérance religieuse ?', 'mcq',
   '["Voltaire", "Napoléon", "Robespierre", "James Watt"]', 0,
   'Voltaire lutte contre l''intolérance religieuse et défend la liberté d''expression.', 6),
  ('10610000-0000-4000-8000-000000000107'::uuid, 'L''Europe des Lumières',
   'L''Encyclopédie a été dirigée par Diderot et d''Alembert.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''Encyclopédie (1751-1772) a été dirigée par Diderot et d''Alembert.', 7),
  ('10610000-0000-4000-8000-000000000108'::uuid, 'L''Europe des Lumières',
   'Selon Rousseau, à qui appartient la souveraineté ?', 'mcq',
   '["Au peuple", "Au roi seul", "À l''Église", "Aux nobles"]', 0,
   'Dans « Du contrat social », Rousseau affirme que la souveraineté appartient au peuple.', 8),
  ('10610000-0000-4000-8000-000000000109'::uuid, 'L''Europe des Lumières',
   'Les philosophes des Lumières défendaient l''ignorance et les superstitions.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : ils combattaient l''ignorance et le fanatisme au nom de la raison.', 9),
  ('10610000-0000-4000-8000-000000000110'::uuid, 'L''Europe des Lumières',
   'Où les idées des Lumières circulaient-elles surtout ?', 'mcq',
   '["Dans les salons et les livres", "Uniquement à l''église", "À la cour du roi seulement", "Nulle part"]', 0,
   'Les idées circulaient dans les salons, les cafés et par les livres, malgré la censure.', 10),

  -- Chapitre 2 — La Révolution française et l'Empire
  ('10610000-0000-4000-8000-000000000204'::uuid, 'La Révolution française et l''Empire',
   'Quel événement a eu lieu le 14 juillet 1789 ?', 'mcq',
   '["La prise de la Bastille", "Le sacre de Napoléon", "La bataille de Waterloo", "La mort de Louis XIV"]', 0,
   'Le 14 juillet 1789, les Parisiens prennent la Bastille, symbole de l''arbitraire royal.', 4),
  ('10610000-0000-4000-8000-000000000205'::uuid, 'La Révolution française et l''Empire',
   'Que proclame la Déclaration des droits de l''homme et du citoyen (août 1789) ?', 'mcq',
   '["La liberté et l''égalité", "Le retour de la monarchie absolue", "Les privilèges de la noblesse", "La guerre à l''Angleterre"]', 0,
   'La DDHC (26 août 1789) affirme la liberté, l''égalité et la souveraineté de la nation.', 5),
  ('10610000-0000-4000-8000-000000000206'::uuid, 'La Révolution française et l''Empire',
   'En quelle année la République est-elle proclamée ?', 'mcq',
   '["1792", "1789", "1804", "1815"]', 0,
   'La Ire République est proclamée le 22 septembre 1792.', 6),
  ('10610000-0000-4000-8000-000000000207'::uuid, 'La Révolution française et l''Empire',
   'Napoléon Bonaparte s''est fait sacrer empereur en 1804.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Napoléon se fait sacrer empereur des Français en 1804.', 7),
  ('10610000-0000-4000-8000-000000000208'::uuid, 'La Révolution française et l''Empire',
   'Quel grand code juridique Napoléon met-il en place en 1804 ?', 'mcq',
   '["Le Code civil", "L''Encyclopédie", "La DDHC", "Le Concordat de Worms"]', 0,
   'Le Code civil (1804) unifie le droit français ; c''est un héritage durable.', 8),
  ('10610000-0000-4000-8000-000000000209'::uuid, 'La Révolution française et l''Empire',
   'La nuit du 4 août 1789 marque l''abolition des privilèges.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Dans la nuit du 4 août 1789, l''Assemblée abolit les privilèges de l''Ancien Régime.', 9),
  ('10610000-0000-4000-8000-000000000210'::uuid, 'La Révolution française et l''Empire',
   'Qui dirige la période de la Terreur (1793-1794) ?', 'mcq',
   '["Robespierre", "Voltaire", "Louis XVI", "Montesquieu"]', 0,
   'Robespierre est la principale figure de la Terreur (1793-1794).', 10),

  -- Chapitre 3 — L'Europe de la révolution industrielle
  ('10610000-0000-4000-8000-000000000304'::uuid, 'L''Europe de la révolution industrielle',
   'Quelle machine est au cœur de la révolution industrielle ?', 'mcq',
   '["La machine à vapeur", "La machine à laver", "L''ordinateur", "Le moteur à réaction"]', 0,
   'La machine à vapeur (perfectionnée par James Watt) fait tourner usines et trains.', 4),
  ('10610000-0000-4000-8000-000000000305'::uuid, 'L''Europe de la révolution industrielle',
   'Quelle énergie alimente la machine à vapeur au XIXe siècle ?', 'mcq',
   '["Le charbon", "Le pétrole", "L''énergie solaire", "L''électricité nucléaire"]', 0,
   'Le charbon est l''énergie principale de la première révolution industrielle.', 5),
  ('10610000-0000-4000-8000-000000000306'::uuid, 'L''Europe de la révolution industrielle',
   'Dans quel pays débute la révolution industrielle ?', 'mcq',
   '["Le Royaume-Uni", "La Chine", "Le Brésil", "La Russie"]', 0,
   'La révolution industrielle démarre au Royaume-Uni à la fin du XVIIIe siècle.', 6),
  ('10610000-0000-4000-8000-000000000307'::uuid, 'L''Europe de la révolution industrielle',
   'Comment appelle-t-on le système économique fondé sur l''investissement de capitaux pour le profit ?', 'mcq',
   '["Le capitalisme", "Le féodalisme", "L''artisanat", "Le troc"]', 0,
   'Le capitalisme repose sur l''investissement de capitaux par des entrepreneurs pour faire du profit.', 7),
  ('10610000-0000-4000-8000-000000000308'::uuid, 'L''Europe de la révolution industrielle',
   'Les ouvriers travaillaient dans d''excellentes conditions au XIXe siècle.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : les ouvriers subissaient de longues journées, de bas salaires et le travail des enfants.', 8),
  ('10610000-0000-4000-8000-000000000309'::uuid, 'L''Europe de la révolution industrielle',
   'Quelle classe sociale riche s''affirme avec l''industrie (patrons, banquiers) ?', 'mcq',
   '["La bourgeoisie", "La noblesse d''épée", "Le clergé", "Les paysans"]', 0,
   'La bourgeoisie (patrons, banquiers, commerçants) devient la classe dominante.', 9),
  ('10610000-0000-4000-8000-000000000310'::uuid, 'L''Europe de la révolution industrielle',
   'Le lieu où l''on produit en masse grâce aux machines s''appelle : ', 'mcq',
   '["L''usine", "Le salon", "Le château", "La cathédrale"]', 0,
   'L''usine remplace l''atelier artisanal et permet la production de masse.', 10),

  -- Chapitre 4 — L'urbanisation du monde
  ('10610000-0000-4000-8000-000000000404'::uuid, 'L''urbanisation du monde',
   'Que désigne l''urbanisation ?', 'mcq',
   '["L''augmentation de la population vivant en ville", "Le retour à la campagne", "La baisse de la population mondiale", "La construction de routes"]', 0,
   'L''urbanisation est l''augmentation de la part de la population qui vit en ville.', 4),
  ('10610000-0000-4000-8000-000000000405'::uuid, 'L''urbanisation du monde',
   'Depuis 2007, plus de la moitié de l''humanité vit en ville.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Depuis 2007, plus d''un humain sur deux est un citadin.', 5),
  ('10610000-0000-4000-8000-000000000406'::uuid, 'L''urbanisation du monde',
   'Comment appelle-t-on la concentration des richesses et des activités dans les grandes villes ?', 'mcq',
   '["La métropolisation", "La désertification", "La littoralisation", "L''exode urbain"]', 0,
   'La métropolisation concentre populations, activités et richesses dans les métropoles.', 6),
  ('10610000-0000-4000-8000-000000000407'::uuid, 'L''urbanisation du monde',
   'Laquelle de ces villes est une grande métropole mondiale ?', 'mcq',
   '["Tokyo", "Un petit village de campagne", "Une station de ski isolée", "Un désert"]', 0,
   'Tokyo, New York ou Shanghai sont de grandes métropoles mondiales.', 7),
  ('10610000-0000-4000-8000-000000000408'::uuid, 'L''urbanisation du monde',
   'Comment nomme-t-on les quartiers pauvres et précaires des grandes villes des Suds ?', 'mcq',
   '["Les bidonvilles", "Les quartiers d''affaires", "Les CBD", "Les zones industrielles"]', 0,
   'Les bidonvilles sont des quartiers pauvres et précaires, fréquents dans les métropoles des Suds.', 8),
  ('10610000-0000-4000-8000-000000000409'::uuid, 'L''urbanisation du monde',
   'Les villes mondiales commandent l''économie mondiale.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les villes mondiales concentrent les fonctions de commandement de l''économie mondiale.', 9),
  ('10610000-0000-4000-8000-000000000410'::uuid, 'L''urbanisation du monde',
   'Quel est un grand défi des villes en forte croissance ?', 'mcq',
   '["La pollution et les transports", "L''absence totale d''habitants", "Le manque de rues", "La disparition de l''électricité"]', 0,
   'Transports, logement et pollution sont des défis majeurs des villes en croissance.', 10),

  -- Chapitre 5 — Les mobilités humaines
  ('10610000-0000-4000-8000-000000000504'::uuid, 'Les mobilités humaines',
   'Qu''est-ce qu''une migration ?', 'mcq',
   '["Un déplacement pour s''installer durablement ailleurs", "Un simple aller-retour en vacances", "Un déménagement dans la même rue", "Une promenade quotidienne"]', 0,
   'La migration est une mobilité définitive : on quitte son pays pour s''installer ailleurs.', 4),
  ('10610000-0000-4000-8000-000000000505'::uuid, 'Les mobilités humaines',
   'Que signifie « émigrer » ?', 'mcq',
   '["Quitter son pays", "Arriver dans un pays", "Rester chez soi", "Faire du tourisme"]', 0,
   'Émigrer, c''est quitter son pays ; immigrer, c''est arriver dans un pays.', 5),
  ('10610000-0000-4000-8000-000000000506'::uuid, 'Les mobilités humaines',
   'Quelle est la cause la plus fréquente des migrations dans le monde ?', 'mcq',
   '["Des raisons économiques (chercher du travail)", "Le goût du sport", "La météo agréable", "La curiosité seule"]', 0,
   'Les migrations sont surtout économiques : chercher du travail et une vie meilleure.', 6),
  ('10610000-0000-4000-8000-000000000507'::uuid, 'Les mobilités humaines',
   'Une personne qui fuit une guerre ou une persécution est un réfugié.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un réfugié migre pour des raisons politiques : fuir une guerre ou une persécution.', 7),
  ('10610000-0000-4000-8000-000000000508'::uuid, 'Les mobilités humaines',
   'Dans quel sens vont surtout les grands flux migratoires ?', 'mcq',
   '["Des pays pauvres (Suds) vers les pays riches (Nords)", "Des pays riches vers les pays pauvres", "Uniquement entre pays riches", "Il n''y a aucun flux"]', 0,
   'Les grands flux migratoires vont surtout des Suds vers les Nords.', 8),
  ('10610000-0000-4000-8000-000000000509'::uuid, 'Les mobilités humaines',
   'Le tourisme est la première mobilité humaine par le nombre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le tourisme est la première mobilité mondiale par le nombre de personnes concernées.', 9),
  ('10610000-0000-4000-8000-000000000510'::uuid, 'Les mobilités humaines',
   'Quel est le pays le plus visité au monde par les touristes ?', 'mcq',
   '["La France", "L''Islande", "Le Canada", "L''Australie"]', 0,
   'La France est le pays le plus visité au monde par les touristes.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
