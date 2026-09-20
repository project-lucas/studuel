-- =============================================================================
-- Studuel — Migration 132 : CONTENU Anglais 1re (cours + carte mentale + quiz)
-- Remplit les 4 chapitres d'Anglais 1re (axes culturels du tronc commun LV,
-- niveau B1→B2) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder initial)
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
-- PRÉREQUIS : subjects/chapters/lessons Anglais 1re, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Identités et échanges', $md$# Identités et échanges

## Ce que tu vas comprendre
Cet axe explore les **échanges** entre les peuples : migrations, commerce, frontières et **mondialisation** (*globalisation*). Tu vas enrichir ton vocabulaire thématique et revoir un point clé de grammaire : les **temps du passé**.

## 1. Migrations et identités
Une **migration** est un déplacement de population. On distingue *emigration* (quitter son pays) et *immigration* (arriver dans un pays).
- *a migrant* = un migrant ; *a refugee* = un réfugié ; *a border* = une frontière.
- *to settle* = s'installer ; *homeland* = terre natale ; *melting pot* = creuset culturel.

*Exemple : « Millions of migrants crossed the Atlantic in search of a better life. » → Des millions de migrants ont traversé l'Atlantique en quête d'une vie meilleure.*

## 2. Frontières et échanges
Une **frontière** peut séparer ou relier. La **mondialisation** rend les échanges plus rapides.
- *trade* = le commerce ; *goods* = les marchandises ; *to exchange* = échanger.
- *cultural diversity* = la diversité culturelle ; *to belong* = appartenir.

## 3. Point de grammaire : les temps du passé
Pour raconter, on choisit le bon temps :
- **Prétérit simple** (*simple past*) : action datée et terminée. *« She moved to London in 2010. »*
- **Present perfect** (*have + participe passé*) : lien avec le présent, sans date précise. *« He has lived here since 2015. »*
- **Past continuous** (*was/were + -ing*) : action en cours dans le passé. *« They were travelling when the war began. »*
- **Past perfect** (*had + participe passé*) : antériorité. *« She had already left when I arrived. »*

> **Piège :** on n'utilise **jamais** de date précise (*in 2010*, *yesterday*) avec le present perfect.

## 4. Vocabulaire à réutiliser
*roots* (racines), *to fit in* (s'intégrer), *sense of belonging* (sentiment d'appartenance), *multicultural society* (société multiculturelle), *opportunity* (opportunité).

## L'essentiel à retenir
- La migration façonne les **identités** : *migrant*, *refugee*, *border*, *homeland*.
- La **mondialisation** intensifie les **échanges** de *goods* et d'idées.
- **Prétérit** = action datée et finie ; **present perfect** = lien avec le présent.
- Jamais de date précise avec le **present perfect**.$md$),

    ('Espace privé et espace public', $md$# Espace privé et espace public

## Ce que tu vas comprendre
Cet axe interroge la limite entre ce qui relève du **privé** et du **public** : vie privée, **surveillance**, égalité des genres et **féminisme**. Point de grammaire : les **modaux**.

## 1. Vie privée et surveillance
La frontière entre *private life* et *public space* se déplace à l'ère numérique.
- *privacy* = la vie privée ; *surveillance* = la surveillance ; *CCTV* = la vidéosurveillance.
- *to monitor* = surveiller ; *data* = les données ; *to track* = pister.

*Exemple : « The government can track citizens through their phones. » → Le gouvernement peut pister les citoyens via leur téléphone.*

## 2. Féminisme et égalité
La sphère publique s'ouvre progressivement à l'égalité.
- *gender equality* = l'égalité des genres ; *the right to vote* = le droit de vote.
- *to empower* = donner du pouvoir ; *glass ceiling* = plafond de verre ; *wage gap* = écart salarial.

## 3. Point de grammaire : les modaux
Les **modaux** (*modal verbs*) expriment une nuance ; ils sont suivis de la **base verbale** (sans *to*) :
- **can / could** : capacité ou possibilité. *« Women can vote. »*
- **must / have to** : obligation. *« You must respect privacy. »*
- **should / ought to** : conseil. *« Governments should protect data. »*
- **may / might** : probabilité. *« Surveillance might reduce crime. »*

> **Piège :** pas de *s* à la 3e personne (*she can*, jamais *she cans*), et pas de *to* après le modal.

## 4. Vocabulaire à réutiliser
*freedom* (liberté), *consent* (consentement), *to protect* (protéger), *civil rights* (droits civiques), *awareness* (prise de conscience).

## L'essentiel à retenir
- **Privacy** vs **public space** : une frontière mouvante à l'ère des *data*.
- **Surveillance** : *to monitor*, *to track*, *CCTV*.
- Le **féminisme** vise *gender equality* : *glass ceiling*, *wage gap*.
- **Modaux** = base verbale, pas de *to*, pas de *s* : *can*, *must*, *should*, *might*.$md$),

    ('Art et pouvoir', $md$# Art et pouvoir

## Ce que tu vas comprendre
Cet axe montre comment l'**art** peut servir ou contester le **pouvoir** : art engagé, **propagande**, **censure**. Point de grammaire : la **voix passive**.

## 1. L'art engagé
L'art peut dénoncer et éveiller les consciences.
- *committed art* = art engagé ; *a painting* = un tableau ; *a mural* = une fresque.
- *to denounce* = dénoncer ; *to raise awareness* = sensibiliser ; *street art* = art de rue.

*Exemple : « Banksy uses street art to criticise society. » → Banksy utilise l'art de rue pour critiquer la société.*

## 2. Propagande et censure
Le pouvoir utilise l'image pour convaincre ou pour contrôler.
- *propaganda* = la propagande ; *a poster* = une affiche ; *censorship* = la censure.
- *to ban* = interdire ; *to silence* = réduire au silence ; *freedom of speech* = liberté d'expression.

## 3. Point de grammaire : la voix passive
La **voix passive** met en avant l'action, pas son auteur. Structure : **be + participe passé**.
- Actif : *« The regime banned the painting. »*
- Passif : *« The painting was banned (by the regime). »*
- L'auteur, s'il est mentionné, est introduit par **by**.
- On l'emploie beaucoup à l'écrit et dans les titres de presse.

> **Piège :** le passif se forme avec l'auxiliaire **be** au bon temps : *is painted* (présent), *was painted* (passé), *has been painted* (present perfect).

## 4. Vocabulaire à réutiliser
*to depict* (représenter), *a masterpiece* (un chef-d'œuvre), *audience* (public), *to influence* (influencer), *a message* (un message).

## L'essentiel à retenir
- L'**art engagé** dénonce : *committed art*, *street art*, *to raise awareness*.
- Le pouvoir recourt à la **propagande** et à la **censure** : *poster*, *to ban*, *censorship*.
- **Voix passive** = **be + participe passé** ; l'auteur suit **by**.
- On adapte le temps de **be** : *is / was / has been + participe passé*.$md$),

    ('Citoyenneté et mondes virtuels', $md$# Citoyenneté et mondes virtuels

## Ce que tu vas comprendre
Cet axe explore la **citoyenneté** à l'ère du numérique : réseaux sociaux, **démocratie numérique**, désinformation. Point de grammaire : le **conditionnel** (*if clauses*).

## 1. Réseaux sociaux et citoyenneté
Le monde virtuel transforme l'engagement citoyen.
- *social media* = les réseaux sociaux ; *a user* = un utilisateur ; *a network* = un réseau.
- *to share* = partager ; *to post* = publier ; *e-citizenship* = citoyenneté numérique.

*Exemple : « Social media can help citizens organise protests. » → Les réseaux sociaux peuvent aider les citoyens à organiser des manifestations.*

## 2. Démocratie numérique et dérives
Le numérique offre des outils, mais aussi des risques.
- *digital democracy* = démocratie numérique ; *fake news* = fausses informations.
- *to spread* = propager ; *echo chamber* = chambre d'écho ; *online activism* = militantisme en ligne.

## 3. Point de grammaire : le conditionnel
Les **phrases hypothétiques** (*if clauses*) expriment une condition :
- **Type 1** (probable) : *if* + présent, → *will* + base. *« If you post fake news, people will believe it. »*
- **Type 2** (irréel du présent) : *if* + prétérit, → *would* + base. *« If everyone checked sources, misinformation would decrease. »*
- **Type 3** (irréel du passé) : *if* + past perfect, → *would have* + participe passé. *« If they had verified, they would not have shared it. »*

> **Piège :** jamais de *will* juste après *if* dans la proposition conditionnelle.

## 4. Vocabulaire à réutiliser
*to engage* (s'engager), *accountability* (responsabilité), *influence* (influence), *a debate* (un débat), *to raise one's voice* (faire entendre sa voix).

## L'essentiel à retenir
- Les **réseaux sociaux** redéfinissent la **citoyenneté** : *to share*, *to post*, *e-citizenship*.
- La **démocratie numérique** affronte les *fake news* et les *echo chambers*.
- **Conditionnel** : type 1 (*will*), type 2 (*would*), type 3 (*would have*).
- Jamais de *will* juste après *if*.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'anglais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Identités et échanges', $json${
      "centre": "Identités et échanges",
      "branches": [
        { "titre": "Migrations", "enfants": ["migrant, refugee, border", "emigration / immigration", "homeland, to settle"] },
        { "titre": "Échanges et mondialisation", "enfants": ["trade, goods, to exchange", "cultural diversity", "melting pot"] },
        { "titre": "Temps du passé", "enfants": ["Prétérit = daté et fini", "Present perfect = lien présent", "Past perfect = antériorité"] },
        { "titre": "Piège à éviter", "enfants": ["Jamais de date + present perfect", "in 2010 → prétérit", "since / for → present perfect"] }
      ]
    }$json$),
    ('Espace privé et espace public', $json${
      "centre": "Espace privé et espace public",
      "branches": [
        { "titre": "Vie privée", "enfants": ["privacy, data", "surveillance, CCTV", "to monitor, to track"] },
        { "titre": "Féminisme et égalité", "enfants": ["gender equality", "glass ceiling", "wage gap, to empower"] },
        { "titre": "Les modaux", "enfants": ["can/could = capacité", "must/should = obligation, conseil", "may/might = probabilité"] },
        { "titre": "Règle des modaux", "enfants": ["Suivis de la base verbale", "Pas de to après", "Pas de s (she can)"] }
      ]
    }$json$),
    ('Art et pouvoir', $json${
      "centre": "Art et pouvoir",
      "branches": [
        { "titre": "Art engagé", "enfants": ["committed art, street art", "to denounce", "to raise awareness"] },
        { "titre": "Propagande et censure", "enfants": ["propaganda, poster", "censorship, to ban", "freedom of speech"] },
        { "titre": "Voix passive", "enfants": ["be + participe passé", "Auteur introduit par by", "Met l'action en avant"] },
        { "titre": "Temps du passif", "enfants": ["is painted (présent)", "was painted (passé)", "has been painted"] }
      ]
    }$json$),
    ('Citoyenneté et mondes virtuels', $json${
      "centre": "Citoyenneté et mondes virtuels",
      "branches": [
        { "titre": "Réseaux sociaux", "enfants": ["social media, user, network", "to share, to post", "e-citizenship"] },
        { "titre": "Démocratie numérique", "enfants": ["digital democracy", "fake news, to spread", "echo chamber"] },
        { "titre": "Le conditionnel", "enfants": ["Type 1 : if + présent → will", "Type 2 : if + prétérit → would", "Type 3 : if + past perfect → would have"] },
        { "titre": "Piège à éviter", "enfants": ["Jamais will après if", "if + présent seulement", "online activism"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'anglais'
 WHERE c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Anglais', '1re', v.chapter, true, l.id
FROM (VALUES
  ('13219999-0000-4000-8000-000000000001'::uuid, 'Identités et échanges'),
  ('13219999-0000-4000-8000-000000000002'::uuid, 'Espace privé et espace public'),
  ('13219999-0000-4000-8000-000000000003'::uuid, 'Art et pouvoir'),
  ('13219999-0000-4000-8000-000000000004'::uuid, 'Citoyenneté et mondes virtuels')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'anglais'
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
  -- Chapitre 1 — Identités et échanges
  ('13210000-0000-4000-8000-000000000104'::uuid, 'Identités et échanges',
   'Que signifie le mot anglais « border » ?', 'mcq',
   '["Une frontière", "Un pont", "Un bateau", "Un passeport"]', 0,
   '« border » se traduit par frontière.', 4),
  ('13210000-0000-4000-8000-000000000105'::uuid, 'Identités et échanges',
   'Comment traduit-on « a refugee » ?', 'mcq',
   '["Un réfugié", "Un touriste", "Un voisin", "Un marin"]', 0,
   '« a refugee » est un réfugié, quelqu''un qui fuit son pays.', 5),
  ('13210000-0000-4000-8000-000000000106'::uuid, 'Identités et échanges',
   'Quel temps emploie-t-on avec une date précise comme « in 2010 » ?', 'mcq',
   '["Le prétérit simple", "Le present perfect", "Le présent", "Le futur"]', 0,
   'Une date précise et révolue appelle le prétérit simple (simple past).', 6),
  ('13210000-0000-4000-8000-000000000107'::uuid, 'Identités et échanges',
   'On peut utiliser le present perfect avec « yesterday ».', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : « yesterday » est une date révolue, on emploie donc le prétérit, pas le present perfect.', 7),
  ('13210000-0000-4000-8000-000000000108'::uuid, 'Identités et échanges',
   'Dans « She had already left when I arrived », quel temps est « had left » ?', 'mcq',
   '["Le past perfect", "Le prétérit simple", "Le present perfect", "Le conditionnel"]', 0,
   '« had + participe passé » forme le past perfect, qui marque l''antériorité.', 8),
  ('13210000-0000-4000-8000-000000000109'::uuid, 'Identités et échanges',
   'Que désigne l''expression « melting pot » ?', 'mcq',
   '["Un creuset culturel", "Une recette de cuisine", "Une usine", "Une frontière"]', 0,
   'Le « melting pot » est l''image d''un creuset où se mêlent les cultures.', 9),
  ('13210000-0000-4000-8000-000000000110'::uuid, 'Identités et échanges',
   'Le present perfect crée un lien entre le passé et le présent.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le present perfect relie une action passée à sa conséquence dans le présent.', 10),

  -- Chapitre 2 — Espace privé et espace public
  ('13210000-0000-4000-8000-000000000204'::uuid, 'Espace privé et espace public',
   'Que signifie « privacy » ?', 'mcq',
   '["La vie privée", "La police", "Le public", "La liberté"]', 0,
   '« privacy » désigne la vie privée, l''intimité.', 4),
  ('13210000-0000-4000-8000-000000000205'::uuid, 'Espace privé et espace public',
   'Que veut dire « glass ceiling » ?', 'mcq',
   '["Le plafond de verre", "Une fenêtre", "Un immeuble", "Un miroir"]', 0,
   'Le « glass ceiling » (plafond de verre) est la barrière invisible qui freine l''ascension des femmes.', 5),
  ('13210000-0000-4000-8000-000000000206'::uuid, 'Espace privé et espace public',
   'Après un modal comme « can », le verbe se met :', 'mcq',
   '["À la base verbale, sans to", "À l''infinitif avec to", "Au prétérit", "Au participe passé"]', 0,
   'Un modal est toujours suivi de la base verbale, sans « to ».', 6),
  ('13210000-0000-4000-8000-000000000207'::uuid, 'Espace privé et espace public',
   'À la 3e personne du singulier, on écrit « she cans ».', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : les modaux ne prennent jamais de « s » à la 3e personne. On écrit « she can ».', 7),
  ('13210000-0000-4000-8000-000000000208'::uuid, 'Espace privé et espace public',
   'Quel modal exprime le mieux un conseil ?', 'mcq',
   '["should", "must", "can", "might"]', 0,
   '« should » (et « ought to ») sert à donner un conseil.', 8),
  ('13210000-0000-4000-8000-000000000209'::uuid, 'Espace privé et espace public',
   'Que désigne « wage gap » ?', 'mcq',
   '["L''écart salarial", "Un congé", "Un contrat", "Une prime"]', 0,
   'Le « wage gap » est l''écart de salaire, souvent entre hommes et femmes.', 9),
  ('13210000-0000-4000-8000-000000000210'::uuid, 'Espace privé et espace public',
   'Le mot « surveillance » renvoie à l''idée de contrôle et d''observation.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : « surveillance » désigne l''observation et le contrôle des personnes.', 10),

  -- Chapitre 3 — Art et pouvoir
  ('13210000-0000-4000-8000-000000000304'::uuid, 'Art et pouvoir',
   'Comment traduit-on « committed art » ?', 'mcq',
   '["L''art engagé", "L''art abstrait", "La sculpture", "La musique"]', 0,
   '« committed art » désigne l''art engagé, qui prend position.', 4),
  ('13210000-0000-4000-8000-000000000305'::uuid, 'Art et pouvoir',
   'Que signifie « censorship » ?', 'mcq',
   '["La censure", "Le musée", "La couleur", "La critique"]', 0,
   '« censorship » se traduit par censure : l''interdiction d''une œuvre ou d''un message.', 5),
  ('13210000-0000-4000-8000-000000000306'::uuid, 'Art et pouvoir',
   'Comment forme-t-on la voix passive en anglais ?', 'mcq',
   '["Avec be + participe passé", "Avec have + base verbale", "Avec do + infinitif", "Avec will + base"]', 0,
   'La voix passive se construit avec l''auxiliaire « be » suivi du participe passé.', 6),
  ('13210000-0000-4000-8000-000000000307'::uuid, 'Art et pouvoir',
   'Dans une phrase passive, l''auteur de l''action est introduit par :', 'mcq',
   '["by", "with", "from", "of"]', 0,
   'On introduit l''auteur (l''agent) avec « by » : « banned by the regime ».', 7),
  ('13210000-0000-4000-8000-000000000308'::uuid, 'Art et pouvoir',
   '« The painting was banned » est une phrase à la voix passive.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : « was banned » = be + participe passé, c''est bien la voix passive.', 8),
  ('13210000-0000-4000-8000-000000000309'::uuid, 'Art et pouvoir',
   'Que signifie « freedom of speech » ?', 'mcq',
   '["La liberté d''expression", "La liberté de mouvement", "Le silence", "Le discours officiel"]', 0,
   '« freedom of speech » est la liberté d''expression.', 9),
  ('13210000-0000-4000-8000-000000000310'::uuid, 'Art et pouvoir',
   'Dans « Banksy uses street art to criticise society », que fait Banksy ?', 'mcq',
   '["Il critique la société par l''art", "Il vend des tableaux", "Il ignore la politique", "Il fait de la publicité"]', 0,
   'Il se sert de l''art de rue (street art) pour critiquer la société.', 10),

  -- Chapitre 4 — Citoyenneté et mondes virtuels
  ('13210000-0000-4000-8000-000000000404'::uuid, 'Citoyenneté et mondes virtuels',
   'Comment traduit-on « social media » ?', 'mcq',
   '["Les réseaux sociaux", "La presse écrite", "La télévision", "La radio"]', 0,
   '« social media » désigne les réseaux sociaux.', 4),
  ('13210000-0000-4000-8000-000000000405'::uuid, 'Citoyenneté et mondes virtuels',
   'Que veut dire « fake news » ?', 'mcq',
   '["De fausses informations", "Des nouvelles fraîches", "Un journal papier", "Un site officiel"]', 0,
   '« fake news » désigne de fausses informations, de la désinformation.', 5),
  ('13210000-0000-4000-8000-000000000406'::uuid, 'Citoyenneté et mondes virtuels',
   'Dans une phrase conditionnelle, que ne met-on jamais juste après « if » ?', 'mcq',
   '["will", "le présent", "le prétérit", "une virgule"]', 0,
   'On ne met jamais « will » après « if » dans la proposition conditionnelle.', 6),
  ('13210000-0000-4000-8000-000000000407'::uuid, 'Citoyenneté et mondes virtuels',
   'Type 1 : « If you post fake news, people ___ believe it. »', 'mcq',
   '["will", "would", "would have", "can"]', 0,
   'Conditionnel de type 1 : if + présent, puis « will » + base verbale.', 7),
  ('13210000-0000-4000-8000-000000000408'::uuid, 'Citoyenneté et mondes virtuels',
   'Le conditionnel de type 2 utilise « would » + base verbale.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : type 2 (irréel du présent) = if + prétérit, puis « would » + base verbale.', 8),
  ('13210000-0000-4000-8000-000000000409'::uuid, 'Citoyenneté et mondes virtuels',
   'Que désigne « echo chamber » ?', 'mcq',
   '["Une chambre d''écho", "Une salle de concert", "Un studio radio", "Un microphone"]', 0,
   'Une « echo chamber » (chambre d''écho) enferme l''internaute dans ses propres opinions.', 9),
  ('13210000-0000-4000-8000-000000000410'::uuid, 'Citoyenneté et mondes virtuels',
   'Les réseaux sociaux peuvent aider les citoyens à s''organiser.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : « Social media can help citizens organise protests » illustre ce rôle mobilisateur.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
