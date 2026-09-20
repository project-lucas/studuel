-- =============================================================================
-- Studuel — Migration 135 : CONTENU SES 1re (cours + carte mentale + quiz)
-- Remplit les 4 chapitres de SES 1re (spécialité, programme officiel) :
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
-- PRÉREQUIS : subjects/chapters/lessons de SES 1re, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Le marché et ses défaillances', $md$# Le marché et ses défaillances

## Ce que tu vas comprendre
Le **marché** est le lieu, réel ou abstrait, où se rencontrent l'**offre** et la **demande** d'un bien. En théorie, il coordonne efficacement les décisions. Mais il connaît des **défaillances** : des situations où il n'aboutit pas à une allocation optimale des ressources.

## 1. Le marché concurrentiel
Le modèle de **concurrence pure et parfaite** repose sur cinq conditions : atomicité (nombreux offreurs et demandeurs), homogénéité du produit, libre entrée et sortie, transparence de l'information, libre circulation des facteurs. Aucun agent ne peut alors influencer le prix : chacun est **preneur de prix**.

## 2. La formation du prix
Le **prix d'équilibre** est celui qui égalise les quantités offertes et demandées. Quand le prix monte, l'offre augmente et la demande diminue ; quand il baisse, c'est l'inverse. Le marché tend spontanément vers ce point de rencontre.

## 3. Le pouvoir de marché
Lorsqu'une entreprise est en **situation de monopole** ou d'**oligopole**, elle dispose d'un **pouvoir de marché** : elle peut fixer un prix supérieur au prix concurrentiel et réduire les quantités. Le surplus se déplace au détriment du consommateur.

## 4. Les externalités
Une **externalité** apparaît quand l'activité d'un agent affecte le bien-être d'un autre sans compensation par le prix.
- **Externalité négative** : la pollution d'une usine subie par les riverains.
- **Externalité positive** : la recherche, la vaccination, qui profitent à tous.
Le marché seul ne les prend pas en compte : l'État peut instaurer une **taxe** (pollueur-payeur) ou une **subvention**.

## 5. Les biens communs et l'asymétrie d'information
- Les **biens communs** (poissons, eau, air) sont rivaux mais non excluables : chacun peut y accéder, d'où le risque de **surexploitation** (la « tragédie des communs »).
- L'**asymétrie d'information** : un agent en sait plus que l'autre. Elle produit la **sélection adverse** (marché des voitures d'occasion) et l'**aléa moral** (assurance).

## L'essentiel à retenir
- Le marché coordonne offre et demande par le **prix d'équilibre**.
- Le **pouvoir de marché** (monopole, oligopole) éloigne du prix concurrentiel.
- Les **externalités** ne sont pas intégrées au prix : l'État corrige par taxe ou subvention.
- **Biens communs** (surexploitation) et **asymétries d'information** (sélection adverse, aléa moral) sont des défaillances majeures.$md$),

    ('La monnaie et le financement', $md$# La monnaie et le financement

## Ce que tu vas comprendre
La **monnaie** est l'instrument qui permet les échanges dans une économie. Le **financement** désigne la manière dont les agents se procurent les ressources dont ils ont besoin pour investir ou consommer. Ce chapitre relie les deux : d'où vient la monnaie, et comment circule-t-elle vers ceux qui en ont besoin.

## 1. Les fonctions de la monnaie
La monnaie remplit trois fonctions classiques :
- **Unité de compte** : elle mesure la valeur des biens dans une même échelle.
- **Intermédiaire des échanges** : elle évite le troc et sa « double coïncidence des besoins ».
- **Réserve de valeur** : elle permet de conserver du pouvoir d'achat dans le temps.

## 2. Les formes de la monnaie
La monnaie a pris des formes successives : monnaie **métallique**, **fiduciaire** (billets et pièces), puis surtout **scripturale** (les dépôts inscrits sur les comptes bancaires), aujourd'hui largement dématérialisée.

## 3. La création monétaire
La monnaie est principalement créée par les **banques commerciales** lorsqu'elles accordent des **crédits** : « les crédits font les dépôts ». Quand un crédit est remboursé, la monnaie correspondante est détruite. La **banque centrale** encadre cette création et émet la monnaie centrale.

## 4. Le rôle des banques et le taux d'intérêt
Les banques assurent l'**intermédiation** : elles collectent l'épargne et prêtent aux agents qui ont besoin de financement. Le **taux d'intérêt** est le prix de cet argent prêté : il rémunère le prêteur et représente un coût pour l'emprunteur. La banque centrale influence les taux pour piloter l'activité et l'inflation.

## 5. Les modes de financement
Un agent peut se financer de deux façons :
- **Financement interne** (autofinancement) : par ses propres ressources, ses bénéfices.
- **Financement externe**, lui-même **direct** (émission d'actions ou d'obligations sur les marchés) ou **indirect** (emprunt auprès d'une banque, on parle d'intermédiation).

## L'essentiel à retenir
- Trois fonctions : **unité de compte**, **intermédiaire des échanges**, **réserve de valeur**.
- La monnaie est aujourd'hui surtout **scripturale**.
- Ce sont les **crédits qui font les dépôts** : les banques créent la monnaie.
- Le **taux d'intérêt** est le prix du financement ; on distingue financement **interne** et **externe** (direct / indirect).$md$),

    ('Socialisation et groupes sociaux', $md$# Socialisation et groupes sociaux

## Ce que tu vas comprendre
La **socialisation** est le processus par lequel un individu apprend et intériorise les normes, les valeurs et les rôles de sa société. Elle explique comment nous devenons des membres d'un groupe, et pourquoi nos comportements ne sont pas seulement individuels mais socialement construits.

## 1. Norme, valeur, rôle
- Une **valeur** est un idéal partagé (la liberté, l'égalité, la réussite).
- Une **norme** est une règle de conduite qui découle des valeurs (dire bonjour, respecter la loi).
- Un **rôle** est le comportement attendu d'un individu selon sa position sociale (le rôle d'élève, de parent).

## 2. La socialisation primaire
La **socialisation primaire** se déroule pendant l'**enfance**. Elle est massive et fondatrice. Les principales **instances** sont la **famille** et l'**école**, relayées par les **pairs** et les **médias**. L'enfant intériorise une première vision du monde.

## 3. La socialisation secondaire
La **socialisation secondaire** a lieu à l'**âge adulte**. Elle prolonge, complète ou parfois contredit la socialisation primaire, au fil des nouvelles expériences : le monde du **travail**, le couple, les groupes fréquentés. Elle montre que la socialisation est un processus **continu**.

## 4. Une socialisation différenciée
La socialisation varie selon le **milieu social** et le **genre**. Les familles ne transmettent pas les mêmes attentes selon leur position sociale ; garçons et filles sont orientés vers des comportements distincts. La socialisation contribue ainsi à **reproduire** les positions sociales.

## 5. Groupes sociaux, réseaux et sociabilité
- Un **groupe social** rassemble des individus qui ont conscience d'appartenir à un même ensemble et entretiennent des relations.
- On distingue le **groupe d'appartenance** (celui auquel on appartient) et le **groupe de référence** (celui auquel on aspire ou dont on adopte les normes).
- Les **réseaux sociaux** relient les individus par des liens ; la **sociabilité** désigne l'ensemble des relations qu'une personne entretient. Les **liens faibles** sont souvent utiles pour trouver un emploi.

## L'essentiel à retenir
- La socialisation transmet **normes**, **valeurs** et **rôles**.
- La socialisation **primaire** (enfance : famille, école) précède la socialisation **secondaire** (âge adulte : travail, couple).
- Elle est **différenciée** selon le milieu social et le genre, ce qui reproduit les positions sociales.
- **Groupe d'appartenance** vs **groupe de référence** ; réseaux et sociabilité structurent nos relations.$md$),

    ('L''opinion publique', $md$# L'opinion publique

## Ce que tu vas comprendre
L'**opinion publique** désigne l'ensemble des jugements que partage une population sur les questions qui la concernent. Ce chapitre interroge la manière dont elle se forme, comment on prétend la mesurer, et le rôle qu'y jouent les médias dans un **espace public** démocratique.

## 1. Qu'est-ce que l'opinion publique ?
L'opinion publique n'est pas une donnée naturelle : c'est une **construction**. Elle se forme dans l'**espace public**, cet espace de débat où circulent les arguments. Elle est plurielle, changeante, et dépend fortement de la manière dont les questions sont posées.

## 2. La formation de l'opinion
L'opinion d'un individu se construit sous l'influence de sa **socialisation**, de son milieu, de ses groupes d'appartenance et des informations auxquelles il est exposé. Elle n'est donc pas purement individuelle : elle reflète des appartenances sociales.

## 3. Les sondages et leurs limites
Les **sondages** cherchent à mesurer l'opinion à partir d'un **échantillon représentatif**. Ils comportent des limites :
- l'**effet de formulation** : la réponse dépend de la façon dont la question est posée ;
- la **marge d'erreur** liée à l'échantillon ;
- le risque de fabriquer une opinion sur des sujets que les enquêtés ne connaissent pas.
Un sondage n'est donc pas une photographie neutre de l'opinion.

## 4. Le rôle des médias
Les **médias** participent à la formation de l'opinion. Par l'**agenda-setting**, ils sélectionnent les sujets dont on parle : ils ne disent pas quoi penser, mais **de quoi** penser. Les réseaux numériques amplifient ce rôle, avec le risque de **bulles de filtres** enfermant chacun dans ses propres opinions.

## 5. Opinion publique et démocratie
Dans une démocratie, l'opinion publique est censée éclairer le débat et peser sur les décisions. Mais sa mesure permanente par les sondages peut aussi transformer la vie politique en course à la popularité. L'enjeu est de préserver un **espace public** pluraliste et argumenté.

## L'essentiel à retenir
- L'opinion publique est une **construction** qui se forme dans l'**espace public**.
- Elle dépend de la **socialisation** et des appartenances sociales, pas seulement de l'individu.
- Les **sondages** la mesurent avec des limites : effet de formulation, marge d'erreur, opinions fabriquées.
- Les **médias** orientent l'attention (**agenda-setting**) ; l'enjeu démocratique est un espace public pluraliste.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'ses'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Le marché et ses défaillances', $json${
      "centre": "Le marché et ses défaillances",
      "branches": [
        { "titre": "Le marché concurrentiel", "enfants": ["Offre rencontre demande", "Concurrence pure et parfaite", "Chacun est preneur de prix"] },
        { "titre": "Prix et pouvoir de marché", "enfants": ["Prix d'équilibre : offre = demande", "Monopole et oligopole", "Prix supérieur au concurrentiel"] },
        { "titre": "Les externalités", "enfants": ["Négative : pollution", "Positive : vaccination", "Correction : taxe ou subvention"] },
        { "titre": "Communs et information", "enfants": ["Biens communs surexploités", "Asymétrie d'information", "Sélection adverse, aléa moral"] }
      ]
    }$json$),
    ('La monnaie et le financement', $json${
      "centre": "La monnaie et le financement",
      "branches": [
        { "titre": "Fonctions de la monnaie", "enfants": ["Unité de compte", "Intermédiaire des échanges", "Réserve de valeur"] },
        { "titre": "Formes de la monnaie", "enfants": ["Métallique puis fiduciaire", "Surtout scripturale", "Dépôts bancaires"] },
        { "titre": "Création monétaire", "enfants": ["Les crédits font les dépôts", "Banques commerciales", "Banque centrale encadre"] },
        { "titre": "Se financer", "enfants": ["Taux d'intérêt = prix de l'argent", "Interne : autofinancement", "Externe : direct / indirect"] }
      ]
    }$json$),
    ('Socialisation et groupes sociaux', $json${
      "centre": "Socialisation et groupes sociaux",
      "branches": [
        { "titre": "Ce qui se transmet", "enfants": ["Valeurs (idéaux partagés)", "Normes (règles de conduite)", "Rôles selon la position"] },
        { "titre": "Primaire", "enfants": ["Pendant l'enfance", "Famille et école", "Pairs et médias"] },
        { "titre": "Secondaire et différenciée", "enfants": ["À l'âge adulte : travail, couple", "Processus continu", "Selon milieu social et genre"] },
        { "titre": "Groupes et réseaux", "enfants": ["Appartenance vs référence", "Sociabilité", "Liens faibles utiles"] }
      ]
    }$json$),
    ('L''opinion publique', $json${
      "centre": "L'opinion publique",
      "branches": [
        { "titre": "Une construction", "enfants": ["Se forme dans l'espace public", "Plurielle et changeante", "Pas une donnée naturelle"] },
        { "titre": "Sa formation", "enfants": ["Influence de la socialisation", "Groupes d'appartenance", "Reflet des appartenances sociales"] },
        { "titre": "Les sondages", "enfants": ["Échantillon représentatif", "Effet de formulation", "Marge d'erreur, opinions fabriquées"] },
        { "titre": "Médias et démocratie", "enfants": ["Agenda-setting : de quoi penser", "Bulles de filtres", "Espace public pluraliste"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'ses'
 WHERE c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (Ce bloc ne fait rien si un quiz existe déjà — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'SES', '1re', v.chapter, true, l.id
FROM (VALUES
  ('13519999-0000-4000-8000-000000000001'::uuid, 'Le marché et ses défaillances'),
  ('13519999-0000-4000-8000-000000000002'::uuid, 'La monnaie et le financement'),
  ('13519999-0000-4000-8000-000000000003'::uuid, 'Socialisation et groupes sociaux'),
  ('13519999-0000-4000-8000-000000000004'::uuid, 'L''opinion publique')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'ses'
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
  -- Chapitre 1 — Le marché et ses défaillances
  ('13510000-0000-4000-8000-000000000104'::uuid, 'Le marché et ses défaillances',
   'Sur un marché, que rencontre l''offre ?', 'mcq',
   '["La demande", "Le profit", "L''État", "L''épargne"]', 0,
   'Le marché est le lieu où se rencontrent l''offre et la demande d''un bien.', 4),
  ('13510000-0000-4000-8000-000000000105'::uuid, 'Le marché et ses défaillances',
   'La pollution d''une usine subie par les riverains est un exemple d''externalité négative.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une externalité négative affecte le bien-être d''autrui sans compensation par le prix : c''est le cas de la pollution.', 5),
  ('13510000-0000-4000-8000-000000000106'::uuid, 'Le marché et ses défaillances',
   'Comment appelle-t-on le prix qui égalise les quantités offertes et demandées ?', 'mcq',
   '["Le prix d''équilibre", "Le prix de monopole", "Le prix plancher", "Le taux d''intérêt"]', 0,
   'Le prix d''équilibre est celui qui égalise offre et demande sur le marché.', 6),
  ('13510000-0000-4000-8000-000000000107'::uuid, 'Le marché et ses défaillances',
   'Dans une situation de monopole, l''entreprise dispose d''un pouvoir de marché.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le monopole permet de fixer un prix supérieur au prix concurrentiel et de réduire les quantités.', 7),
  ('13510000-0000-4000-8000-000000000108'::uuid, 'Le marché et ses défaillances',
   'Quelle situation illustre une asymétrie d''information ?', 'mcq',
   '["Le vendeur d''une voiture d''occasion en sait plus que l''acheteur", "Deux entreprises identiques", "Un prix affiché en vitrine", "Une baisse générale des prix"]', 0,
   'Sur le marché des voitures d''occasion, le vendeur connaît mieux l''état du bien : c''est une asymétrie d''information (sélection adverse).', 8),
  ('13510000-0000-4000-8000-000000000109'::uuid, 'Le marché et ses défaillances',
   'Un bien commun (comme les poissons de l''océan) risque la surexploitation.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Rival mais non excluable, un bien commun est accessible à tous, d''où le risque de surexploitation (« tragédie des communs »).', 9),
  ('13510000-0000-4000-8000-000000000110'::uuid, 'Le marché et ses défaillances',
   'Quel outil l''État peut-il utiliser pour corriger une externalité négative ?', 'mcq',
   '["Une taxe (pollueur-payeur)", "Une subvention aux pollueurs", "La suppression du marché", "Une hausse des salaires"]', 0,
   'Une taxe fait payer au pollueur le coût qu''il impose aux autres : c''est le principe pollueur-payeur.', 10),

  -- Chapitre 2 — La monnaie et le financement
  ('13510000-0000-4000-8000-000000000204'::uuid, 'La monnaie et le financement',
   'Laquelle n''est PAS une fonction de la monnaie ?', 'mcq',
   '["Créer de la richesse par elle-même", "Unité de compte", "Intermédiaire des échanges", "Réserve de valeur"]', 0,
   'Les trois fonctions sont : unité de compte, intermédiaire des échanges, réserve de valeur. La monnaie ne crée pas de richesse par elle-même.', 4),
  ('13510000-0000-4000-8000-000000000205'::uuid, 'La monnaie et le financement',
   'Aujourd''hui, la monnaie est majoritairement scripturale (dépôts sur les comptes).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La monnaie scripturale, inscrite sur les comptes bancaires, représente l''essentiel de la monnaie en circulation.', 5),
  ('13510000-0000-4000-8000-000000000206'::uuid, 'La monnaie et le financement',
   'Qui crée l''essentiel de la monnaie lorsqu''elle accorde des crédits ?', 'mcq',
   '["Les banques commerciales", "Les ménages", "Les entreprises non financières", "L''administration fiscale"]', 0,
   '« Les crédits font les dépôts » : ce sont les banques commerciales qui créent la monnaie en prêtant.', 6),
  ('13510000-0000-4000-8000-000000000207'::uuid, 'La monnaie et le financement',
   'Le taux d''intérêt représente le prix du financement.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le taux d''intérêt rémunère le prêteur et constitue un coût pour l''emprunteur : c''est le prix de l''argent prêté.', 7),
  ('13510000-0000-4000-8000-000000000208'::uuid, 'La monnaie et le financement',
   'Qu''est-ce que le financement interne ?', 'mcq',
   '["L''autofinancement par ses propres ressources", "Un emprunt bancaire", "L''émission d''actions", "L''émission d''obligations"]', 0,
   'Le financement interne (autofinancement) mobilise les ressources propres de l''agent, comme ses bénéfices.', 8),
  ('13510000-0000-4000-8000-000000000209'::uuid, 'La monnaie et le financement',
   'Émettre des actions sur les marchés est un financement externe direct.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le financement externe direct passe par les marchés (actions, obligations), sans intermédiaire bancaire.', 9),
  ('13510000-0000-4000-8000-000000000210'::uuid, 'La monnaie et le financement',
   'Quel rôle jouent les banques dans le financement de l''économie ?', 'mcq',
   '["L''intermédiation : collecter l''épargne et prêter", "Fixer les impôts", "Produire des biens", "Émettre uniquement des pièces"]', 0,
   'Les banques assurent l''intermédiation : elles collectent l''épargne des uns et prêtent aux autres.', 10),

  -- Chapitre 3 — Socialisation et groupes sociaux
  ('13510000-0000-4000-8000-000000000304'::uuid, 'Socialisation et groupes sociaux',
   'Qu''est-ce qu''une norme sociale ?', 'mcq',
   '["Une règle de conduite qui découle des valeurs", "Un idéal abstrait", "Un revenu moyen", "Un groupe d''amis"]', 0,
   'La norme est une règle de conduite (dire bonjour, respecter la loi) qui traduit concrètement les valeurs.', 4),
  ('13510000-0000-4000-8000-000000000305'::uuid, 'Socialisation et groupes sociaux',
   'La socialisation primaire se déroule surtout pendant l''enfance.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La socialisation primaire, massive et fondatrice, a lieu durant l''enfance via la famille et l''école.', 5),
  ('13510000-0000-4000-8000-000000000306'::uuid, 'Socialisation et groupes sociaux',
   'Quelles sont les principales instances de la socialisation primaire ?', 'mcq',
   '["La famille et l''école", "L''entreprise et le syndicat", "Les banques et l''État", "Les partis et les médias seuls"]', 0,
   'La famille et l''école sont les principales instances de la socialisation primaire, relayées par les pairs et les médias.', 6),
  ('13510000-0000-4000-8000-000000000307'::uuid, 'Socialisation et groupes sociaux',
   'La socialisation s''arrête totalement à la fin de l''enfance.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la socialisation est un processus continu. La socialisation secondaire se poursuit à l''âge adulte (travail, couple).', 7),
  ('13510000-0000-4000-8000-000000000308'::uuid, 'Socialisation et groupes sociaux',
   'La socialisation est différenciée selon le milieu social et le genre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les familles transmettent des attentes différentes selon leur position sociale et selon le genre, ce qui reproduit les positions sociales.', 8),
  ('13510000-0000-4000-8000-000000000309'::uuid, 'Socialisation et groupes sociaux',
   'Comment appelle-t-on le groupe auquel un individu aspire et dont il adopte les normes ?', 'mcq',
   '["Le groupe de référence", "Le groupe d''appartenance", "Le groupe primaire", "Le réseau faible"]', 0,
   'Le groupe de référence est celui auquel on aspire ; le groupe d''appartenance est celui auquel on appartient effectivement.', 9),
  ('13510000-0000-4000-8000-000000000310'::uuid, 'Socialisation et groupes sociaux',
   'Selon les analyses des réseaux, les liens faibles sont souvent utiles pour trouver un emploi.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les liens faibles (connaissances éloignées) donnent accès à des informations nouvelles, utiles notamment pour l''emploi.', 10),

  -- Chapitre 4 — L'opinion publique
  ('13510000-0000-4000-8000-000000000404'::uuid, 'L''opinion publique',
   'L''opinion publique est avant tout : ', 'mcq',
   '["Une construction sociale", "Une donnée naturelle et fixe", "Le résultat d''un seul individu", "Une loi votée"]', 0,
   'L''opinion publique n''est pas naturelle : c''est une construction qui se forme dans l''espace public.', 4),
  ('13510000-0000-4000-8000-000000000405'::uuid, 'L''opinion publique',
   'Un sondage donne toujours une image parfaitement exacte de l''opinion.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : un sondage comporte des limites (effet de formulation, marge d''erreur, opinions parfois fabriquées).', 5),
  ('13510000-0000-4000-8000-000000000406'::uuid, 'L''opinion publique',
   'Comment appelle-t-on l''effet par lequel la réponse dépend de la façon dont la question est posée ?', 'mcq',
   '["L''effet de formulation", "L''aléa moral", "L''agenda-setting", "La sélection adverse"]', 0,
   'L''effet de formulation : la manière de poser la question influence la réponse obtenue.', 6),
  ('13510000-0000-4000-8000-000000000407'::uuid, 'L''opinion publique',
   'Par l''agenda-setting, les médias influencent surtout : ', 'mcq',
   '["De quoi les gens parlent", "Le prix des biens", "Le taux d''intérêt", "La création monétaire"]', 0,
   'L''agenda-setting : les médias ne disent pas quoi penser, mais de quoi penser en sélectionnant les sujets.', 7),
  ('13510000-0000-4000-8000-000000000408'::uuid, 'L''opinion publique',
   'Un sondage s''appuie sur un échantillon censé être représentatif de la population.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le sondage mesure l''opinion à partir d''un échantillon représentatif, ce qui introduit une marge d''erreur.', 8),
  ('13510000-0000-4000-8000-000000000409'::uuid, 'L''opinion publique',
   'Qu''est-ce qu''une « bulle de filtres » sur les réseaux numériques ?', 'mcq',
   '["Un enfermement dans ses propres opinions", "Une taxe sur les médias", "Un type de sondage", "Une valeur sociale"]', 0,
   'Les algorithmes exposent surtout à des contenus conformes à nos opinions : c''est la bulle de filtres.', 9),
  ('13510000-0000-4000-8000-000000000410'::uuid, 'L''opinion publique',
   'L''espace public désigne l''espace de débat où circulent les arguments.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''espace public est le lieu de débat où se confrontent les arguments et où se forme l''opinion publique.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'ses'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
