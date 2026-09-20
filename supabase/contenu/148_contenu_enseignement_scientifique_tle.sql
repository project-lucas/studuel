-- =============================================================================
-- Studuel — Migration 148 : CONTENU Enseignement scientifique Tle (+ exercices types)
-- Remplit les 4 chapitres d'Enseignement scientifique Terminale (tronc commun) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices types → lessons.content de « Exercices types » (position 2) :
--                       2 exercices d'exploitation de données corrigés par chapitre.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons (slug 'enseignement-scientifique', 'Tle'),
-- mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('L''atmosphère et le climat', $md$# L'atmosphère et le climat

## Ce que tu vas comprendre
Le climat de la Terre résulte d'un équilibre entre l'énergie reçue du Soleil et l'énergie renvoyée vers l'espace. Ce chapitre explique le bilan radiatif, l'effet de serre, et la façon dont on reconstitue les climats du passé et dont on projette ceux du futur.

## 1. Le bilan radiatif de la Terre
La Terre reçoit en permanence de l'énergie solaire, en moyenne environ **340 W/m²** à sa surface. Une partie — environ **30 %**, l'**albédo** — est directement renvoyée vers l'espace par les nuages, la glace et l'atmosphère. Le reste est absorbé, puis réémis sous forme de **rayonnement infrarouge**.
À l'équilibre, l'énergie reçue = l'énergie renvoyée : la température moyenne reste stable.

## 2. L'effet de serre
Certains gaz atmosphériques — la **vapeur d'eau (H₂O)**, le **dioxyde de carbone (CO₂)**, le **méthane (CH₄)** — absorbent le rayonnement infrarouge émis par le sol et le réémettent en partie vers la surface. C'est l'**effet de serre**, un phénomène naturel indispensable.

*Sans effet de serre, la température moyenne de la Terre serait d'environ **−18 °C** ; grâce à lui, elle est d'environ **+15 °C**.*

## 3. Un effet de serre renforcé
Depuis l'ère industrielle, les activités humaines (combustion d'énergies fossiles, déforestation) augmentent la concentration de CO₂ : d'environ **280 ppm** vers 1850 à plus de **410 ppm** aujourd'hui. Ce **forçage radiatif** supplémentaire déséquilibre le bilan et réchauffe la surface.

## 4. Reconstituer les climats du passé
On reconstitue les climats anciens à l'aide d'**archives naturelles** : bulles d'air piégées dans les **carottes de glace**, isotopes de l'oxygène, pollens, cernes des arbres. Elles montrent une forte corrélation entre teneur en CO₂ et température.

## 5. Modéliser le climat futur
Les climatologues utilisent des **modèles numériques** qui simulent l'atmosphère et les océans. Selon les **scénarios d'émissions**, ils projettent un réchauffement. Le système est **complexe** : il comporte des **rétroactions**, comme la fonte des glaces qui diminue l'albédo et amplifie le réchauffement (rétroaction positive).

## L'essentiel à retenir
- Le **bilan radiatif** compare l'énergie solaire reçue et l'énergie renvoyée ; l'**albédo** vaut environ 0,3.
- L'**effet de serre** (H₂O, CO₂, CH₄) réchauffe la surface : sans lui, −18 °C au lieu de +15 °C.
- Les activités humaines **renforcent** l'effet de serre (CO₂ de 280 à plus de 410 ppm).
- On lit le passé dans les **carottes de glace** et on projette le futur avec des **modèles** intégrant des **rétroactions**.$md$),

    ('L''énergie : conversions et enjeux', $md$# L'énergie : conversions et enjeux

## Ce que tu vas comprendre
L'énergie ne se crée pas et ne se détruit pas : elle se **convertit** d'une forme à une autre. Ce chapitre distingue l'énergie disponible et l'énergie utile, définit le rendement, et présente les enjeux des ressources et de la transition énergétique.

## 1. Les formes et conversions de l'énergie
L'énergie existe sous plusieurs formes : **cinétique**, **potentielle**, **thermique**, **chimique**, **électrique**, **rayonnante**, **nucléaire**. Un dispositif technique **convertit** une forme en une autre.

*Exemple : une centrale thermique convertit l'énergie chimique d'un combustible en chaleur, puis en énergie mécanique, puis en énergie électrique.*

## 2. La conservation de l'énergie
Lors de toute conversion, l'**énergie totale se conserve** (premier principe). Elle se mesure en **joules (J)** ; la **puissance**, énergie par seconde, en **watts (W)**. On retiendra que 1 kWh = 3,6 × 10⁶ J.

## 3. Énergie libérée, énergie utile et pertes
L'énergie **libérée** (ou fournie) par une source n'est jamais entièrement transformée en énergie **utile** : une partie est **dissipée**, le plus souvent sous forme de **chaleur** (frottements, effet Joule).

## 4. Le rendement
Le **rendement** d'un convertisseur est le rapport entre l'énergie utile et l'énergie fournie :

**η = énergie utile / énergie fournie**

Il est toujours **inférieur à 1** (souvent exprimé en %).

*Exemple : un moteur reçoit 100 J et fournit 30 J de travail utile → η = 30/100 = 0,30 = **30 %**. Les 70 J restants partent en chaleur.*

## 5. Ressources et transition énergétique
- Les ressources **fossiles** (charbon, pétrole, gaz) sont **épuisables** et émettrices de CO₂.
- Les ressources **renouvelables** (solaire, éolien, hydraulique, biomasse) se reconstituent à l'échelle humaine.

La **transition énergétique** vise à réduire la part des fossiles, à améliorer les rendements et à développer la sobriété et l'efficacité énergétiques.

## L'essentiel à retenir
- L'énergie se **conserve** et se **convertit** ; elle se mesure en **joules**, la puissance en **watts**.
- Toute conversion s'accompagne de **pertes**, surtout sous forme de **chaleur**.
- **Rendement η = énergie utile / énergie fournie**, toujours < 1.
- La **transition énergétique** remplace peu à peu les ressources **fossiles** épuisables par des ressources **renouvelables**.$md$),

    ('Une histoire du vivant', $md$# Une histoire du vivant

## Ce que tu vas comprendre
Le vivant change en permanence : les espèces apparaissent, se transforment et disparaissent. Ce chapitre présente la biodiversité, les modèles de dynamique des populations et les mécanismes de l'évolution.

## 1. La biodiversité
La **biodiversité** désigne la diversité du vivant à trois niveaux : la diversité des **écosystèmes**, la diversité des **espèces**, et la diversité **génétique** (au sein d'une même espèce).
Elle n'est pas figée : elle **évolue** au cours du temps et connaît aujourd'hui une **érosion** rapide liée aux activités humaines.

## 2. La dynamique des populations
L'**effectif** d'une population varie selon les **naissances**, les **morts**, les arrivées et les départs. On cherche à modéliser ces variations pour les prévoir.

## 3. Le modèle exponentiel
Quand les ressources sont illimitées, une population croît de façon **exponentielle** : à chaque intervalle de temps, l'effectif est multiplié par un même facteur.

*Exemple : une population de bactéries qui double toutes les 20 minutes suit une croissance exponentielle.*

## 4. Le modèle logistique
Dans un milieu réel, les ressources sont **limitées**. La croissance ralentit et l'effectif tend vers une valeur maximale, la **capacité de charge (K)** du milieu : c'est le **modèle logistique**, plus réaliste que le modèle exponentiel.

## 5. Les mécanismes de l'évolution
La **sélection naturelle** (Darwin) favorise les individus dont les caractères sont les mieux **adaptés** à leur milieu : ils survivent et se reproduisent davantage, transmettant leurs allèles.
La **dérive génétique** modifie au hasard la fréquence des allèles, surtout dans les **petites populations**.
Ces mécanismes, agissant sur la **variabilité génétique**, expliquent l'**évolution** des espèces.

## L'essentiel à retenir
- La **biodiversité** se lit à trois niveaux : écosystèmes, espèces, gènes.
- Le modèle **exponentiel** décrit une croissance sans limite ; le modèle **logistique** intègre la **capacité de charge K**.
- La **sélection naturelle** favorise les individus les mieux adaptés ; la **dérive génétique** agit au hasard.
- Un **modèle** est une représentation simplifiée : utile pour prévoir, mais toujours limité.$md$),

    ('L''intelligence artificielle', $md$# L'intelligence artificielle

## Ce que tu vas comprendre
L'intelligence artificielle (IA) regroupe des programmes capables de réaliser des tâches qui semblent exiger de l'« intelligence ». Ce chapitre explique le rôle des données, le principe de l'apprentissage automatique et les enjeux éthiques.

## 1. Qu'est-ce que l'IA ?
Une **intelligence artificielle** est un ensemble d'**algorithmes** conçus pour résoudre des problèmes : reconnaître une image, traduire un texte, recommander un contenu. Elle ne « comprend » pas : elle calcule à partir de règles et de données.

## 2. Le rôle des données
Les IA modernes ont besoin de très grandes quantités de **données** (le *big data*) pour fonctionner. La qualité et la représentativité des données déterminent la qualité des résultats.

*Exemple : pour reconnaître des chats, un programme est entraîné sur des milliers d'images étiquetées « chat » ou « non-chat ».*

## 3. L'apprentissage automatique
Plutôt que de programmer toutes les règles à la main, on laisse la machine **apprendre** à partir d'exemples : c'est l'**apprentissage automatique** (*machine learning*).
- En apprentissage **supervisé**, les données sont **étiquetées** (on connaît la bonne réponse).
- En apprentissage **non supervisé**, la machine regroupe seule les données qui se ressemblent.

## 4. Comment la machine « apprend »
Pendant l'**entraînement**, l'algorithme ajuste ses **paramètres** pour réduire ses erreurs. Les **réseaux de neurones artificiels** empilent de nombreux calculs simples et sont à la base de l'apprentissage profond (*deep learning*).

## 5. Les enjeux éthiques
L'IA soulève des questions de société :
- **Biais** : une IA entraînée sur des données biaisées reproduit et amplifie ces biais.
- **Vie privée** : la collecte massive de données personnelles pose la question du consentement.
- **Emploi et responsabilité** : automatisation des tâches, transparence des décisions.

Une utilisation responsable suppose des données de qualité, de la **transparence** et un **contrôle humain**.

## L'essentiel à retenir
- Une **IA** est un ensemble d'**algorithmes** qui traitent des **données** pour accomplir une tâche.
- L'**apprentissage automatique** apprend à partir d'exemples : **supervisé** (données étiquetées) ou **non supervisé**.
- L'**entraînement** ajuste les **paramètres** d'un modèle (souvent des **réseaux de neurones**) pour réduire l'erreur.
- Les enjeux **éthiques** portent sur les **biais**, la **vie privée** et la **responsabilité**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'enseignement-scientifique'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('L''atmosphère et le climat', $json${
      "centre": "L'atmosphère et le climat",
      "branches": [
        { "titre": "Bilan radiatif", "enfants": ["Soleil : ~340 W/m² reçus", "Albédo ~30 % renvoyés", "Réémission en infrarouge"] },
        { "titre": "Effet de serre", "enfants": ["H₂O, CO₂, CH₄", "Absorbent l'infrarouge", "Sans lui : −18 °C au lieu de +15 °C"] },
        { "titre": "Climats du passé", "enfants": ["Carottes de glace", "Isotopes, pollens, cernes", "CO₂ et température corrélés"] },
        { "titre": "Climat futur", "enfants": ["Modèles numériques", "Scénarios d'émissions", "Rétroaction : fonte → albédo ↓"] }
      ]
    }$json$),
    ('L''énergie : conversions et enjeux', $json${
      "centre": "L'énergie : conversions et enjeux",
      "branches": [
        { "titre": "Formes et conversions", "enfants": ["Cinétique, thermique, chimique…", "Un dispositif convertit", "Mesure en joules (J)"] },
        { "titre": "Conservation", "enfants": ["L'énergie totale se conserve", "Puissance en watts (W)", "1 kWh = 3,6 MJ"] },
        { "titre": "Utile et pertes", "enfants": ["Énergie utile < fournie", "Pertes surtout en chaleur", "Frottements, effet Joule"] },
        { "titre": "Rendement et ressources", "enfants": ["η = utile / fournie < 1", "Fossiles épuisables", "Renouvelables et transition"] }
      ]
    }$json$),
    ('Une histoire du vivant', $json${
      "centre": "Une histoire du vivant",
      "branches": [
        { "titre": "Biodiversité", "enfants": ["Écosystèmes, espèces, gènes", "Évolue au cours du temps", "Érosion actuelle"] },
        { "titre": "Modèle exponentiel", "enfants": ["Ressources illimitées", "× même facteur à chaque étape", "Bactéries qui doublent"] },
        { "titre": "Modèle logistique", "enfants": ["Ressources limitées", "Capacité de charge K", "Plus réaliste"] },
        { "titre": "Évolution", "enfants": ["Sélection naturelle (Darwin)", "Dérive génétique (hasard)", "Agit sur la variabilité"] }
      ]
    }$json$),
    ('L''intelligence artificielle', $json${
      "centre": "L'intelligence artificielle",
      "branches": [
        { "titre": "Les données", "enfants": ["Big data", "Données étiquetées", "Qualité des données = résultats"] },
        { "titre": "Apprentissage", "enfants": ["Supervisé : étiquettes", "Non supervisé : regroupe", "Apprendre par l'exemple"] },
        { "titre": "Algorithmes", "enfants": ["Réseaux de neurones", "Ajuste ses paramètres", "Réduit l'erreur"] },
        { "titre": "Enjeux éthiques", "enfants": ["Biais des données", "Vie privée", "Responsabilité, transparence"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'enseignement-scientifique'
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Ens. scientifique', 'Tle', v.chapter, true, l.id
FROM (VALUES
  ('14819999-0000-4000-8000-000000000001'::uuid, 'L''atmosphère et le climat'),
  ('14819999-0000-4000-8000-000000000002'::uuid, 'L''énergie : conversions et enjeux'),
  ('14819999-0000-4000-8000-000000000003'::uuid, 'Une histoire du vivant'),
  ('14819999-0000-4000-8000-000000000004'::uuid, 'L''intelligence artificielle')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'enseignement-scientifique'
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
  -- Chapitre 1 — L'atmosphère et le climat
  ('14810000-0000-4000-8000-000000000104'::uuid, 'L''atmosphère et le climat',
   'Quelle est la valeur approximative de l''albédo de la Terre ?', 'mcq',
   '["Environ 30 %", "Environ 70 %", "Environ 5 %", "Environ 100 %"]', 0,
   'Environ 30 % de l''énergie solaire reçue est directement renvoyée vers l''espace : c''est l''albédo.', 4),
  ('14810000-0000-4000-8000-000000000105'::uuid, 'L''atmosphère et le climat',
   'Lequel de ces gaz N''EST PAS un gaz à effet de serre ?', 'mcq',
   '["Le diazote (N₂)", "Le dioxyde de carbone (CO₂)", "La vapeur d''eau (H₂O)", "Le méthane (CH₄)"]', 0,
   'Le diazote n''absorbe pas l''infrarouge ; les gaz à effet de serre sont surtout H₂O, CO₂ et CH₄.', 5),
  ('14810000-0000-4000-8000-000000000106'::uuid, 'L''atmosphère et le climat',
   'Sans effet de serre, la température moyenne de la Terre serait d''environ −18 °C.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Sans effet de serre : environ −18 °C ; grâce à lui : environ +15 °C.', 6),
  ('14810000-0000-4000-8000-000000000107'::uuid, 'L''atmosphère et le climat',
   'Quel rayonnement la surface de la Terre émet-elle principalement ?', 'mcq',
   '["Un rayonnement infrarouge", "Un rayonnement ultraviolet", "Un rayonnement visible", "Aucun rayonnement"]', 0,
   'La surface, plus froide que le Soleil, réémet dans l''infrarouge, absorbé par les gaz à effet de serre.', 7),
  ('14810000-0000-4000-8000-000000000108'::uuid, 'L''atmosphère et le climat',
   'Comment reconstitue-t-on la teneur en CO₂ de l''atmosphère du passé ?', 'mcq',
   '["Les bulles d''air des carottes de glace", "Les prévisions météo", "Les satellites actuels", "La température de l''air d''aujourd''hui"]', 0,
   'Les bulles d''air piégées dans les carottes de glace conservent la composition de l''atmosphère ancienne.', 8),
  ('14810000-0000-4000-8000-000000000109'::uuid, 'L''atmosphère et le climat',
   'La fonte des glaces diminue l''albédo et amplifie le réchauffement : c''est une rétroaction positive.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Moins de glace → moins d''énergie renvoyée → plus de réchauffement → encore moins de glace.', 9),
  ('14810000-0000-4000-8000-000000000110'::uuid, 'L''atmosphère et le climat',
   'À l''équilibre radiatif, la Terre : ', 'mcq',
   '["Renvoie autant d''énergie qu''elle en reçoit", "Reçoit plus qu''elle ne renvoie", "Ne renvoie aucune énergie", "Absorbe toute l''énergie reçue"]', 0,
   'À l''équilibre, énergie reçue = énergie renvoyée : la température moyenne reste stable.', 10),

  -- Chapitre 2 — L'énergie : conversions et enjeux
  ('14810000-0000-4000-8000-000000000204'::uuid, 'L''énergie : conversions et enjeux',
   'Que dit le principe de conservation de l''énergie lors d''une conversion ?', 'mcq',
   '["L''énergie totale se conserve", "L''énergie augmente", "L''énergie disparaît", "L''énergie utile égale l''énergie fournie"]', 0,
   'L''énergie ne se crée ni ne se détruit : elle se transforme, l''énergie totale reste constante.', 4),
  ('14810000-0000-4000-8000-000000000205'::uuid, 'L''énergie : conversions et enjeux',
   'Quelle est l''unité de l''énergie dans le Système international ?', 'mcq',
   '["Le joule (J)", "Le watt (W)", "Le volt (V)", "Le newton (N)"]', 0,
   'L''énergie se mesure en joules ; le watt est l''unité de puissance (1 W = 1 J/s).', 5),
  ('14810000-0000-4000-8000-000000000206'::uuid, 'L''énergie : conversions et enjeux',
   'Un moteur reçoit 100 J et fournit 30 J de travail utile. Quel est son rendement ?', 'mcq',
   '["30 %", "70 %", "130 %", "3 %"]', 0,
   'η = énergie utile / énergie fournie = 30/100 = 0,30 = 30 %.', 6),
  ('14810000-0000-4000-8000-000000000207'::uuid, 'L''énergie : conversions et enjeux',
   'Le rendement d''un convertisseur d''énergie peut dépasser 100 %.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Impossible : une partie de l''énergie est toujours perdue, le rendement est toujours inférieur à 1 (100 %).', 7),
  ('14810000-0000-4000-8000-000000000208'::uuid, 'L''énergie : conversions et enjeux',
   'Sous quelle forme l''énergie est-elle le plus souvent dissipée lors des pertes ?', 'mcq',
   '["La chaleur", "La lumière", "L''énergie chimique", "L''énergie nucléaire"]', 0,
   'Les pertes se font surtout sous forme de chaleur (frottements, effet Joule).', 8),
  ('14810000-0000-4000-8000-000000000209'::uuid, 'L''énergie : conversions et enjeux',
   'Laquelle de ces ressources énergétiques est renouvelable ?', 'mcq',
   '["L''énergie solaire", "Le charbon", "Le pétrole", "Le gaz naturel"]', 0,
   'Le solaire se reconstitue à l''échelle humaine ; charbon, pétrole et gaz sont des ressources fossiles épuisables.', 9),
  ('14810000-0000-4000-8000-000000000210'::uuid, 'L''énergie : conversions et enjeux',
   'La combustion des énergies fossiles émet du CO₂.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Brûler charbon, pétrole ou gaz libère du CO₂, principal gaz responsable du réchauffement.', 10),

  -- Chapitre 3 — Une histoire du vivant
  ('14810000-0000-4000-8000-000000000304'::uuid, 'Une histoire du vivant',
   'À quels niveaux mesure-t-on la biodiversité ?', 'mcq',
   '["Écosystèmes, espèces et gènes", "Uniquement les espèces", "Uniquement les écosystèmes", "Les continents et les océans"]', 0,
   'La biodiversité se décline en diversité des écosystèmes, des espèces et diversité génétique.', 4),
  ('14810000-0000-4000-8000-000000000305'::uuid, 'Une histoire du vivant',
   'Dans un modèle exponentiel, l''effectif d''une population : ', 'mcq',
   '["Est multiplié par un même facteur à chaque étape", "Reste constant", "Diminue régulièrement", "Atteint tout de suite un maximum"]', 0,
   'Croissance exponentielle : à chaque intervalle, l''effectif est multiplié par un même facteur (ressources illimitées).', 5),
  ('14810000-0000-4000-8000-000000000306'::uuid, 'Une histoire du vivant',
   'Comment appelle-t-on l''effectif maximal qu''un milieu peut supporter ?', 'mcq',
   '["La capacité de charge (K)", "Le rendement", "L''albédo", "La médiane"]', 0,
   'Dans le modèle logistique, la population tend vers la capacité de charge K du milieu.', 6),
  ('14810000-0000-4000-8000-000000000307'::uuid, 'Une histoire du vivant',
   'La sélection naturelle favorise les individus les mieux adaptés à leur milieu.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les individus les mieux adaptés survivent et se reproduisent davantage : c''est la sélection naturelle (Darwin).', 7),
  ('14810000-0000-4000-8000-000000000308'::uuid, 'Une histoire du vivant',
   'La dérive génétique agit surtout : ', 'mcq',
   '["Dans les petites populations", "Dans les très grandes populations", "Uniquement chez les plantes", "Sans jamais modifier les allèles"]', 0,
   'La dérive génétique, due au hasard, a d''autant plus d''effet que la population est petite.', 8),
  ('14810000-0000-4000-8000-000000000309'::uuid, 'Une histoire du vivant',
   'Le modèle logistique est plus réaliste que le modèle exponentiel parce qu''il : ', 'mcq',
   '["Tient compte de ressources limitées", "Ignore les ressources", "Suppose une croissance infinie", "Ne dépend pas du milieu"]', 0,
   'Le modèle logistique intègre la limitation des ressources (capacité de charge).', 9),
  ('14810000-0000-4000-8000-000000000310'::uuid, 'Une histoire du vivant',
   'Un modèle mathématique est une représentation simplifiée de la réalité, avec des limites.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un modèle simplifie le réel : utile pour prévoir, mais toujours limité.', 10),

  -- Chapitre 4 — L'intelligence artificielle
  ('14810000-0000-4000-8000-000000000404'::uuid, 'L''intelligence artificielle',
   'De quoi une IA moderne a-t-elle besoin en grande quantité pour être entraînée ?', 'mcq',
   '["De données", "De silence", "De hasard pur", "D''aucune information"]', 0,
   'Les IA modernes s''entraînent sur de très grandes quantités de données (big data).', 4),
  ('14810000-0000-4000-8000-000000000405'::uuid, 'L''intelligence artificielle',
   'En apprentissage supervisé, les données d''entraînement sont : ', 'mcq',
   '["Étiquetées (la bonne réponse est connue)", "Toujours secrètes", "Sans aucune structure", "Générées au hasard"]', 0,
   'En apprentissage supervisé, chaque exemple est étiqueté avec la réponse attendue.', 5),
  ('14810000-0000-4000-8000-000000000406'::uuid, 'L''intelligence artificielle',
   'Une IA entraînée sur des données biaisées peut reproduire et amplifier ces biais.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La qualité des résultats dépend des données : des données biaisées produisent des décisions biaisées.', 6),
  ('14810000-0000-4000-8000-000000000407'::uuid, 'L''intelligence artificielle',
   'Qu''ajuste un algorithme d''apprentissage pendant l''entraînement ?', 'mcq',
   '["Ses paramètres, pour réduire ses erreurs", "La vitesse de l''ordinateur", "La taille de l''écran", "Le nombre d''utilisateurs"]', 0,
   'L''entraînement ajuste les paramètres du modèle afin de minimiser l''erreur.', 7),
  ('14810000-0000-4000-8000-000000000408'::uuid, 'L''intelligence artificielle',
   'Sur quoi repose l''apprentissage profond (deep learning) ?', 'mcq',
   '["Des réseaux de neurones artificiels", "Un simple tableur", "Un rapporteur", "Une carte de géographie"]', 0,
   'L''apprentissage profond empile de nombreux calculs dans des réseaux de neurones artificiels.', 8),
  ('14810000-0000-4000-8000-000000000409'::uuid, 'L''intelligence artificielle',
   'En apprentissage non supervisé, la machine regroupe seule les données qui se ressemblent.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Sans étiquettes, l''algorithme organise les données par ressemblance (regroupement).', 9),
  ('14810000-0000-4000-8000-000000000410'::uuid, 'L''intelligence artificielle',
   'Quel est un enjeu éthique majeur de l''IA ?', 'mcq',
   '["Le respect de la vie privée", "La couleur des écrans", "La vitesse du vent", "Le prix de l''électricité seul"]', 0,
   'La collecte massive de données personnelles pose la question du consentement et de la vie privée.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'enseignement-scientifique'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPES — lessons.content de « Exercices types » (position 2)
--    2 exercices d'exploitation de données corrigés par chapitre.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('L''atmosphère et le climat', $md$# Exercices types — L'atmosphère et le climat

## Exercice 1 — Bilan d'énergie d'une planète
Une planète reçoit du Soleil une puissance moyenne de **340 W/m²**. Son albédo vaut **0,30** : 30 % de cette énergie est renvoyée directement vers l'espace.

a) Calcule la puissance moyenne réellement absorbée par 1 m² de la planète.
b) À l'équilibre radiatif, que peut-on dire de la puissance renvoyée vers l'espace par rapport à la puissance absorbée ?

### Correction
a) La fraction renvoyée est 30 %, donc la fraction absorbée est 70 %.
Puissance absorbée = 340 × (1 − 0,30) = 340 × 0,70 = **238 W/m²**.

b) À l'équilibre radiatif, la planète renvoie vers l'espace **autant d'énergie qu'elle en absorbe**, soit 238 W/m² sous forme de rayonnement infrarouge. Sa température moyenne reste alors stable. Si la puissance renvoyée devenait inférieure (effet de serre renforcé), la planète se réchaufferait.

## Exercice 2 — Lecture d'une courbe CO₂–température
Une carotte de glace fournit, pour les 400 000 dernières années, deux courbes superposées : la teneur en CO₂ (en ppm) et la température (en °C). On observe que les deux courbes montent et descendent **en même temps**.

a) Que traduit le fait que les deux courbes varient de façon parallèle ?
b) Aujourd'hui, la teneur en CO₂ dépasse 410 ppm alors qu'elle oscillait entre 180 et 300 ppm sur la période. Qu'en déduis-tu ?

### Correction
a) La variation parallèle traduit une **forte corrélation** entre la teneur en CO₂ et la température : quand le CO₂ augmente, la température augmente, ce qui est cohérent avec l'effet de serre.

b) La valeur actuelle (plus de 410 ppm) est **très supérieure** au maximum naturel des 400 000 dernières années (300 ppm). Cette hausse rapide, due aux activités humaines, renforce l'effet de serre et explique le réchauffement climatique actuel.$md$),

    ('L''énergie : conversions et enjeux', $md$# Exercices types — L'énergie : conversions et enjeux

## Exercice 1 — Rendement d'une ampoule
Une ampoule reçoit une puissance électrique de **60 W**. Elle produit une puissance lumineuse utile de **9 W** ; le reste est dissipé sous forme de chaleur.

a) Calcule le rendement de cette ampoule.
b) Quelle puissance est perdue sous forme de chaleur ?

### Correction
a) Rendement = puissance utile / puissance fournie = 9 / 60 = 0,15 = **15 %**.

b) Puissance perdue = puissance fournie − puissance utile = 60 − 9 = **51 W**, dissipés en chaleur.
Une ampoule à LED, de bien meilleur rendement, fournirait la même lumière avec beaucoup moins de puissance : c'est un enjeu d'efficacité énergétique.

## Exercice 2 — Chaîne énergétique d'une centrale
Dans une centrale thermique, l'énergie chimique du combustible est convertie en chaleur, puis en énergie mécanique (turbine), puis en énergie électrique (alternateur). Pour **100 J** d'énergie chimique consommée, la centrale fournit **38 J** d'énergie électrique.

a) Écris la chaîne des conversions d'énergie.
b) Calcule le rendement global et indique la forme principale des pertes.

### Correction
a) Chaîne des conversions : énergie **chimique** → énergie **thermique** (chaleur) → énergie **mécanique** → énergie **électrique**.

b) Rendement global = 38 / 100 = 0,38 = **38 %**.
Les pertes (100 − 38 = 62 J) partent essentiellement sous forme de **chaleur**, notamment au niveau de la source chaude et du refroidissement. Améliorer ce rendement est un enjeu de la transition énergétique.$md$),

    ('Une histoire du vivant', $md$# Exercices types — Une histoire du vivant

## Exercice 1 — Croissance d'une population de bactéries
Une culture contient au départ **1 000 bactéries**. Leur nombre **double toutes les 20 minutes**, tant que les ressources sont abondantes.

a) Combien y a-t-il de bactéries au bout de 1 heure ?
b) De quel type de modèle s'agit-il ? Pourquoi cette croissance ne peut-elle pas durer indéfiniment ?

### Correction
a) 1 heure = 60 min = **3 périodes** de 20 min. L'effectif est multiplié par 2 trois fois :
1 000 × 2 × 2 × 2 = 1 000 × 8 = **8 000 bactéries**.

b) C'est un **modèle exponentiel** (multiplication par un même facteur à chaque période).
Cette croissance ne peut pas durer : dans un milieu réel, les **ressources sont limitées**. La croissance ralentit et l'effectif tend vers la **capacité de charge K** : on passe alors à un **modèle logistique**.

## Exercice 2 — Sélection naturelle chez des papillons
Dans une région, des papillons existent sous deux formes : claire et sombre. Après que les troncs d'arbres ont noirci à cause de la pollution, on observe au fil des générations que la forme **sombre** devient de plus en plus fréquente.

a) Explique cette évolution à l'aide de la sélection naturelle.
b) Quel serait l'effet inverse si l'environnement redevenait clair ?

### Correction
a) Sur des troncs noircis, les papillons **sombres** sont mieux **camouflés** : ils échappent davantage aux prédateurs, survivent et se reproduisent plus. Ils transmettent donc plus souvent leurs allèles : la fréquence de la forme sombre **augmente**. C'est la **sélection naturelle**.

b) Si l'environnement redevenait clair, les papillons **clairs** seraient à leur tour avantagés (mieux camouflés). La fréquence de la forme claire augmenterait de nouveau : la sélection dépend toujours du **milieu**.$md$),

    ('L''intelligence artificielle', $md$# Exercices types — L'intelligence artificielle

## Exercice 1 — Entraîner un classificateur d'images
On veut entraîner une IA à reconnaître si une photo contient un chat. On dispose de **10 000 images** déjà **étiquetées** « chat » ou « non-chat ».

a) S'agit-il d'apprentissage supervisé ou non supervisé ? Justifie.
b) Pourquoi la qualité et la diversité des images d'entraînement sont-elles importantes ?

### Correction
a) C'est de l'apprentissage **supervisé** : chaque image est **étiquetée** avec la bonne réponse (« chat » ou « non-chat »), et la machine apprend à retrouver cette étiquette.

b) Si les images sont peu variées (par exemple uniquement des chats noirs), l'IA apprendra un modèle **biaisé** et se trompera sur les cas absents des données. Des données **nombreuses, variées et de qualité** sont nécessaires pour que le modèle **généralise** correctement.

## Exercice 2 — Un biais dans les données
Une entreprise entraîne une IA de tri de candidatures à partir de ses embauches passées. Comme, historiquement, elle a surtout recruté un certain profil, l'IA se met à défavoriser les autres profils.

a) D'où vient ce comportement de l'IA ?
b) Propose deux mesures pour rendre l'usage de cette IA plus éthique.

### Correction
a) Le comportement vient d'un **biais des données** d'entraînement : l'IA reproduit les choix passés, y compris leurs discriminations. Elle n'invente pas le biais, elle l'**amplifie** à partir des données.

b) Deux mesures possibles :
- Utiliser des **données plus représentatives** et vérifier l'absence de biais avant l'entraînement.
- Assurer la **transparence** des décisions et garder un **contrôle humain** sur les résultats de l'IA.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'enseignement-scientifique'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
